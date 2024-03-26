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
const Patient_model_1 = __importDefault(require("../model/Patient.model"));
const PatientVersion_dao_1 = __importDefault(require("./PatientVersion.dao"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
class PatientDAO {
    constructor(session) {
        this.logger = new Logger_1.default();
        this.session = session;
    }
    handleError(error) {
        this.logger.log(error.stack || error.toString());
        return null;
    }
    getAll(populate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patients = yield Patient_model_1.default.find({ isDeleted: false }).populate(populate ? 'editedBy' : '');
                return patients;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getById(_id, asObject = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield Patient_model_1.default.findOne({ _id }, null, {
                    session: this.session,
                });
                if (!patient)
                    return null;
                else if (asObject)
                    return patient.toObject();
                else
                    return patient;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getByDNI(dni, isDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield Patient_model_1.default.findOne({ dni, isDeleted });
                return patient;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(patient, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                patient.editedBy = createdBy;
                const newPatient = new Patient_model_1.default(patient);
                yield newPatient.save({ session: this.session });
                return newPatient;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    update(id, patient, editedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current = (yield this.getById(id, true));
                if (!current)
                    throw new Error('Paciente no encontrado.');
                const savedPatient = yield new PatientVersion_dao_1.default(this.session).create(current);
                if (!savedPatient)
                    throw new Error('Error al guardar versión del paciente.');
                patient.editedBy = editedBy;
                patient.editedAt = Date.now();
                delete patient.__v;
                const updatedPatient = yield Patient_model_1.default.findByIdAndUpdate(id, { $set: patient, $inc: { __v: 1 } }, { new: true, session: this.session });
                return updatedPatient;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    delete(id, deletedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedPatient = yield Patient_model_1.default.findByIdAndUpdate(id, {
                    $set: { isDeleted: true, deletedAt: Date.now(), deletedBy },
                });
                return deletedPatient;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = PatientDAO;
