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
const PatientVersion_model_1 = __importDefault(require("../model/versions/PatientVersion.model"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
class PatientVersionDAO {
    constructor(session) {
        this.logger = new Logger_1.default();
        this.session = session;
    }
    handleError(error) {
        this.logger.log(error.stack || error.toString());
        return null;
    }
    getAllById(_id, populate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patients = yield PatientVersion_model_1.default.find({ refId: _id })
                    .populate(populate ? ['editedBy'] : '');
                return patients;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield PatientVersion_model_1.default.findOne({ _id });
                return patient === null || patient === void 0 ? void 0 : patient.toObject();
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(patient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentId = patient._id;
                delete patient._id;
                const newPatientVersion = new PatientVersion_model_1.default(Object.assign(Object.assign({}, patient), { refId: currentId, __v: patient.__v }));
                yield newPatientVersion.save({ session: this.session });
                return newPatientVersion;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = PatientVersionDAO;
