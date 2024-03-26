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
/* eslint-disable @typescript-eslint/no-explicit-any */
const Stretcher_model_1 = __importDefault(require("../model/Stretcher.model"));
const StretcherVersion_dao_1 = __importDefault(require("./StretcherVersion.dao"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
const Patient_dao_1 = __importDefault(require("./Patient.dao"));
class StretcherDAO {
    constructor(session) {
        this.logger = new Logger_1.default();
        this.session = session;
    }
    handleError(error) {
        this.logger.log(error.stack || error.toString());
        return null;
    }
    getAll(populate, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = includeDeleted ? {} : { isDeleted: false };
                const stretchers = (yield Stretcher_model_1.default.find(filter).populate(populate ? 'editedBy' : ''));
                if (populate) {
                    return yield Promise.all(stretchers.map((stretcher) => __awaiter(this, void 0, void 0, function* () {
                        const patient = yield new Patient_dao_1.default().getById(stretcher.patientId);
                        // Reemplaza el patientId con el paciente completo
                        return Object.assign(Object.assign({}, stretcher.toObject()), { patientId: patient });
                    })));
                }
                return stretchers;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getById(id, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stretcher = yield Stretcher_model_1.default.findOne({ _id: id }, null, {
                    session: this.session,
                }).populate(populate ? 'patientId' : '');
                return stretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getOneFreeStretcher() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stretcher = yield Stretcher_model_1.default.findOne({ patientId: null });
                return stretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(stretcher, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                stretcher.editedBy = createdBy;
                const newStretcher = new Stretcher_model_1.default(stretcher);
                yield newStretcher.save({ session: this.session });
                return newStretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    update(id, stretcher, editedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current = yield this.getById(id, false);
                if (!current)
                    throw new Error('Cama no encontrada.');
                const savedStretcher = yield new StretcherVersion_dao_1.default(this.session).create(current.toJSON());
                if (!savedStretcher)
                    throw new Error('Error al guardar la versión de la cama.');
                stretcher.editedBy = editedBy;
                stretcher.editedAt = Date.now();
                delete stretcher.__v;
                const updatedStretcher = yield Stretcher_model_1.default.findByIdAndUpdate(id, { $set: stretcher, $inc: { __v: 1 } }, { new: true });
                return updatedStretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    delete(_id, deletedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /**
                 * OBTINE LA INFORMACION DE LA CAMA QUE SE VA A ELIMINAR
                 */
                const stretcher = yield this.getById(_id, false);
                if (!stretcher)
                    throw new Error('Cama no encontrada.');
                /**
                 * OBTIENE LA INFORMACION DEL PACIENTE QUE ESTA OCUPANDO LA CAMA
                 */
                const patient = yield new Patient_dao_1.default().getById(stretcher.patientId);
                /**
                 * ACTUALIZA LA CAMA ESTABLECIENDO EL CAMPO isDeleted EN TRUE
                 * Y ACTUALIZANDO LOS CAMPOS deletedAt, deletedBy Y patientId
                 * patientId DEBE SER EL DOCUMENTO ACTUAL DEL PACIENTE QUE ESTA
                 * OCUPANDO LA CAMA
                 */
                const deletedStretcher = yield Stretcher_model_1.default.findByIdAndUpdate({ _id }, {
                    isDeleted: true,
                    patientId: patient,
                    deletedAt: Date.now(),
                    deletedBy: deletedBy,
                }, {
                    session: this.session,
                });
                if (!deletedStretcher)
                    throw new Error('Error al eliminar la cama.');
                /**
                 * CREA UNA CAMA NUEVA CON EL MISMO LABEL Y AID QUE LA CAMA
                 * QUE SE ACABA DE ELIMINAR
                 */
                const newStretcher = yield this.create({
                    label: deletedStretcher.label,
                    aid: deletedStretcher.aid,
                }, deletedBy);
                if (!newStretcher)
                    throw new Error('Error al crear la copia de la cama.');
                return deletedStretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = StretcherDAO;
