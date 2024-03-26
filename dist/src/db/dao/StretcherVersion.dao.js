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
const StretcherVersion_model_1 = __importDefault(require("../model/versions/StretcherVersion.model"));
const Stretcher_dao_1 = __importDefault(require("./Stretcher.dao"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
const Patient_dao_1 = __importDefault(require("./Patient.dao"));
class StretcherVersionDAO {
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
                const stretcher = yield StretcherVersion_model_1.default.find().populate(this.populateOptions(populate));
                return stretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getAllBy(_id, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stretcher = yield StretcherVersion_model_1.default.find({
                    refId: _id,
                }).populate(this.populateOptions(populate !== null && populate !== void 0 ? populate : false));
                const curStretcher = yield new Stretcher_dao_1.default().getById(_id, populate);
                if (!curStretcher)
                    throw new Error('Error al obtener la cama.');
                if (populate && !curStretcher.isDeleted && curStretcher.patientId) {
                    const patient = yield new Patient_dao_1.default().getById(curStretcher.patientId);
                    if (!patient)
                        throw new Error('Error al obtener el paciente.');
                    curStretcher.patientId = patient;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stretcher.push(curStretcher);
                return stretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(stretcher) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentId = stretcher._id;
                delete stretcher._id;
                const patient = yield new Patient_dao_1.default(this.session).getById(stretcher.patientId);
                const newStretcher = new StretcherVersion_model_1.default(Object.assign(Object.assign({}, stretcher), { refId: currentId, patientId: patient, __v: stretcher.__v }));
                yield newStretcher.save({ session: this.session });
                return newStretcher;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = StretcherVersionDAO;
