"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Laboratory_model_1 = __importDefault(require("../model/Laboratory.model"));
const LabVersion_dao_1 = __importDefault(require("./LabVersion.dao"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
class LaboratoryDAO {
    constructor(session) {
        this.logger = new Logger_1.default();
        this.session = session;
    }
    handleError(error) {
        this.logger.log(error.stack || error.toString());
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAll(populate = false, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let laboratories;
                if (!includeDeleted) {
                    laboratories = yield Laboratory_model_1.default.find({
                        isDeleted: false,
                    }).populate(populate ? 'editedBy' : '');
                }
                else {
                    laboratories = yield Laboratory_model_1.default.find().populate(populate ? 'editedBy' : '');
                }
                return laboratories;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getById(_id, _populate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const laboratory = yield Laboratory_model_1.default.findOne({ _id });
                if (!laboratory)
                    return null;
                return laboratory.toObject();
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(patient, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newLab = new Laboratory_model_1.default({
                    patientId: patient,
                    editedBy: createdBy,
                    createdAt: Date.now(),
                });
                yield newLab.save();
                return newLab;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    update(_id, currentLab, newLab, userId, patient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const labVersionDAO = yield new LabVersion_dao_1.default(this.session).create(currentLab);
                if (!labVersionDAO)
                    return null;
                const updatedFields = this.mergeNestedValues(currentLab, newLab);
                updatedFields.patientId = patient;
                updatedFields.editedBy = userId;
                updatedFields.editedAt = Date.now();
                const updatedLab = yield Laboratory_model_1.default.findByIdAndUpdate({ _id }, { $set: updatedFields, $inc: { __v: 1 } }, { new: true, session: this.session });
                return updatedLab;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    mergeNestedValues(currentLab, newLab) {
        var _a, _b, _c;
        const updatedFields = {};
        for (const [key, value] of Object.entries(newLab)) {
            if (typeof value === 'object') {
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (Object.prototype.toString.call(subValue) === '[object Object]') {
                        value[subKey] = Object.assign(Object.assign({}, ((_b = (_a = currentLab[key]) === null || _a === void 0 ? void 0 : _a[subKey]) !== null && _b !== void 0 ? _b : {})), subValue);
                    }
                }
                updatedFields[key] = Object.assign(Object.assign({}, ((_c = currentLab[key]) !== null && _c !== void 0 ? _c : {})), value);
            }
            else
                updatedFields[key] = value;
        }
        return updatedFields;
    }
    delete(lab, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedLab = yield Laboratory_model_1.default.findByIdAndUpdate({ _id: lab._id }, {
                    $set: { isDeleted: true, deletedBy: userId, deletedAt: Date.now() },
                });
                return deletedLab;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = LaboratoryDAO;
