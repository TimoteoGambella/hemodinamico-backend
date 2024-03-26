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
const Laboratory_dao_1 = __importDefault(require("../../../db/dao/Laboratory.dao"));
const LabVersion_dao_1 = __importDefault(require("../../../db/dao/LabVersion.dao"));
const Patient_dao_1 = __importDefault(require("../../../db/dao/Patient.dao"));
const mongoose_1 = require("mongoose");
exports.default = {
    getById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { populate } = req.query;
        try {
            const shouldPopulate = populate === 'true';
            const laboratory = yield new Laboratory_dao_1.default().getById(id, shouldPopulate);
            if (!laboratory) {
                res.status(404).json({ message: 'Laboratorio no encontrado.' });
                return;
            }
            res.status(200).json({ message: 'Get laboratory', data: laboratory });
        }
        catch (error) {
            next(error);
        }
    }),
    getAll: (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { populate, includeDeleted } = _req.query;
        try {
            const shouldPopulate = populate === 'true';
            const laboratories = yield new Laboratory_dao_1.default().getAll(shouldPopulate, includeDeleted === 'true');
            if (!laboratories)
                throw new Error('Could not obtain all laboratories.');
            res
                .status(200)
                .json({ message: 'Get all laboratories', data: laboratories });
        }
        catch (error) {
            next(error);
        }
    }),
    getVersionsById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { populate, excludeCurrent } = req.query;
        try {
            const shouldPopulate = populate === 'true';
            const exist = yield new Laboratory_dao_1.default().getById(id, true);
            if (!exist) {
                res.status(404).json({ message: 'Laboratorio no encontrado.' });
                return;
            }
            const laboratories = yield new LabVersion_dao_1.default().getAllById(id, shouldPopulate);
            if (!laboratories)
                throw new Error('Could not obtain all laboratories.');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (excludeCurrent !== 'true')
                laboratories.push(exist);
            res
                .status(200)
                .json({ message: 'Get all versions of laboratory', data: laboratories });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllVersions: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { populate } = req.query;
        try {
            const shouldPopulate = populate === 'true';
            const laboratories = yield new LabVersion_dao_1.default().getAll(shouldPopulate);
            if (!laboratories)
                throw new Error('Could not obtain all laboratories.');
            res
                .status(200)
                .json({ message: 'Get all versions of laboratory', data: laboratories });
        }
        catch (error) {
            next(error);
        }
    }),
    create: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const req = request;
        const { patientId } = req.body;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            if (!patientId)
                res.status(400).json({ message: 'El ID del paciente es requerido.' });
            const patient = yield new Patient_dao_1.default().getById(patientId);
            if (!patient) {
                res.status(404).json({ message: 'Paciente no encontrado.' });
                return;
            }
            else {
                if (patient.laboratoryId) {
                    res
                        .status(409)
                        .json({ message: 'El paciente ya tiene asociado un laboratorio.' });
                    return;
                }
                const lab = yield new Laboratory_dao_1.default().create(patient, (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id);
                if (!lab)
                    throw new Error('Laboratory could not be created.');
                yield new Patient_dao_1.default().update(patientId, {
                    laboratoryId: lab._id,
                }, (_d = (_c = req.session) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d._id);
                yield session.commitTransaction();
                res
                    .status(201)
                    .json({ message: 'Laboratory created successfully.', data: lab });
            }
        }
        catch (error) {
            yield session.abortTransaction();
            next(error);
        }
        finally {
            session.endSession();
        }
    }),
    /**
     * @summary Esta función se deberia ejecutar justo despues de actualziar la información del paciente de ser el caso
     */
    update: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g;
        const { id } = req.params;
        const laboratory = req.body;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            laboratory.infective.resultado =
                ((_e = laboratory === null || laboratory === void 0 ? void 0 : laboratory.infective) === null || _e === void 0 ? void 0 : _e.resultado) === 'true';
            if (!laboratory || Object.keys(laboratory).length === 0) {
                res.status(400).json({
                    message: 'No se ha proporcionado la información de laboratorio.',
                });
                return;
            }
            const exist = yield new Laboratory_dao_1.default().getById(id);
            if (!exist) {
                res.status(404).json({ message: 'Laboratorio no encontrado.' });
                return;
            }
            const patient = yield new Patient_dao_1.default(session).getById(exist.patientId._id, false);
            if (!patient) {
                res.status(404).json({ message: 'Paciente no encontrado.' });
                return;
            }
            laboratory.patient = patient;
            const lab = yield new Laboratory_dao_1.default(session).update(id, exist, laboratory, (_g = (_f = req.session) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g._id, patient);
            if (!lab)
                throw new Error('Laboratory could not be updated.');
            yield session.commitTransaction();
            res
                .status(200)
                .json({ message: 'Laboratory updated successfully.', data: lab });
        }
        catch (error) {
            yield session.abortTransaction();
            next(error);
        }
        finally {
            session.endSession();
        }
    }),
    delete: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _h, _j, _k, _l;
        const req = request;
        const { id } = req.params;
        try {
            const lab = yield new Laboratory_dao_1.default().getById(id);
            if (!lab) {
                res.status(404).json({ message: 'Laboratorio no encontrado.' });
                return;
            }
            const deleted = yield new Laboratory_dao_1.default().delete(lab, (_j = (_h = req.session) === null || _h === void 0 ? void 0 : _h.user) === null || _j === void 0 ? void 0 : _j._id);
            if (!deleted)
                throw new Error('Laboratory could not be deleted.');
            yield new Patient_dao_1.default().update(String(lab.patientId._id), {
                laboratoryId: null,
            }, (_l = (_k = req.session) === null || _k === void 0 ? void 0 : _k.user) === null || _l === void 0 ? void 0 : _l._id);
            res
                .status(200)
                .json({ message: 'Laboratory deleted successfully.', data: deleted });
        }
        catch (error) {
            next(error);
        }
    }),
};
