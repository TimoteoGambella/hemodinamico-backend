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
const StretcherVersion_dao_1 = __importDefault(require("../../../db/dao/StretcherVersion.dao"));
const Stretcher_dao_1 = __importDefault(require("../../../db/dao/Stretcher.dao"));
const Patient_dao_1 = __importDefault(require("../../../db/dao/Patient.dao"));
const mongoose_1 = require("mongoose");
exports.default = {
    getAll: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { populate, includeDeleted } = req.query;
        try {
            const shouldPopulate = populate === 'true';
            const shouldIncludeDeleted = includeDeleted === 'true';
            const stretcher = yield new Stretcher_dao_1.default().getAll(shouldPopulate, shouldIncludeDeleted);
            if (!stretcher)
                throw new Error('Error al obtener las camillas.');
            res.status(200).json({ message: 'Get all stretcher', data: stretcher });
        }
        catch (error) {
            next(error);
        }
    }),
    getOne: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { populate } = req.query;
        try {
            const stretcher = yield new Stretcher_dao_1.default().getById(id, populate === 'true');
            if (!stretcher)
                throw new Error('Error al obtener la camilla.');
            res.status(200).json({ message: 'Get one stretcher', data: stretcher });
        }
        catch (error) {
            next(error);
        }
    }),
    getVersionsById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { populate } = req.query;
        try {
            const exist = yield new Stretcher_dao_1.default().getById(id);
            if (!exist) {
                res.status(404).json({ message: 'Cama no encontrada.' });
                return;
            }
            const stretcher = yield new StretcherVersion_dao_1.default().getAllBy(id, populate === 'true');
            if (!stretcher)
                throw new Error('Error al obtener las versiones de la camilla.');
            res.status(200).json({
                message: 'Get all versions of stretcher',
                data: stretcher,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllVersions: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { populate } = req.query;
        try {
            const shouldPopulate = populate === 'true';
            const stretcher = yield new StretcherVersion_dao_1.default().getAll(shouldPopulate);
            if (!stretcher)
                throw new Error('Error al obtener las versiones de las camillas.');
            res.status(200).json({
                message: 'Get all versions of stretcher',
                data: stretcher,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    update: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const req = request;
        const { id } = req.params;
        const { flush } = req.query;
        const stretcher = req.body;
        try {
            if (flush === 'true') {
                res.status(501).json({ message: 'Flush not implemented yet.' });
                return;
            }
            const updatedStretcher = yield new Stretcher_dao_1.default().update(String(id), stretcher, req.session.user._id);
            if (!updatedStretcher)
                throw new Error('Error al actualizar la camilla.');
            res.status(200).json({
                message: 'Camilla actualizada exitosamente.',
                data: updatedStretcher,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    delete: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const req = request;
        const { id } = req.params;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const exist = yield new Stretcher_dao_1.default().getById(id, false);
            if (!exist) {
                res.status(404).json({ message: 'Cama no encontrada.' });
                return;
            }
            else if (exist.__v === 0) {
                res.status(400).json({
                    message: 'No se puede eliminar una cama que no ha sido modificada.',
                });
                return;
            }
            const patient = yield new Patient_dao_1.default().update(String(exist.patientId), { stretcherId: null }, req.session.user._id);
            if (!patient) {
                session.abortTransaction();
                res.status(500).json({
                    message: 'Error al actualizar la información del paciente asociado a la cama.',
                });
                return;
            }
            const deletedStretcher = yield new Stretcher_dao_1.default().delete(String(id), req.session.user._id);
            if (!deletedStretcher)
                throw new Error('Error al eliminar la camilla.');
            yield session.commitTransaction();
            res.status(200).json({
                message: 'Cama eliminada exitosamente.',
                data: deletedStretcher,
            });
        }
        catch (error) {
            yield session.abortTransaction();
            next(error);
        }
        finally {
            session.endSession();
        }
    }),
};
