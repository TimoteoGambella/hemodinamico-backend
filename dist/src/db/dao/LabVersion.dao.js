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
const LabVersion_model_1 = __importDefault(require("../model/versions/LabVersion.model"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
class LabVersionDAO {
    constructor(session) {
        this.logger = new Logger_1.default();
        this.session = session;
    }
    handleError(error) {
        this.logger.log(error.stack || error.toString());
        return null;
    }
    populateOptions(populate) {
        return populate
            ? [{ path: 'editedBy', select: '-password' }, 'patientId']
            : [];
    }
    getAll(populate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const laboratories = yield LabVersion_model_1.default.find().populate(this.populateOptions(populate));
                return laboratories;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getAllById(_id, populate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const laboratories = yield LabVersion_model_1.default.find({ refId: _id })
                    .populate(this.populateOptions(populate));
                return laboratories;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const laboratory = yield LabVersion_model_1.default.findOne({ _id });
                return laboratory === null || laboratory === void 0 ? void 0 : laboratory.toObject();
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    updateRefIsDeleted(refId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield LabVersion_model_1.default.updateMany({ refId }, { refIsDeleted: true });
                return updated;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(lab) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentId = lab._id;
                delete lab._id;
                const newLabVersion = new LabVersion_model_1.default(Object.assign(Object.assign({}, lab), { refId: currentId, __v: lab.__v }));
                yield newLabVersion.save({ session: this.session });
                return newLabVersion;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = LabVersionDAO;
