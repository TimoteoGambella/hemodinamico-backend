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
const Patient_model_1 = __importDefault(require("../../../db/model/Patient.model"));
const Stretcher_dao_1 = __importDefault(require("../../../db/dao/Stretcher.dao"));
const Patient_dao_1 = __importDefault(require("../../../db/dao/Patient.dao"));
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.default = {
    getAll: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { populate } = req.query;
        try {
            const patients = yield new Patient_dao_1.default().getAll(populate === 'true');
            if (!patients)
                throw new Error('Error al obtener pacientes.');
            res.status(200).json({ message: 'Get all patients', data: patients });
        }
        catch (error) {
            next(error);
        }
    }),
    register: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const req = request;
        const patient = req.body;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const existPatient = yield new Patient_dao_1.default().getByDNI(patient.dni);
            if (existPatient) {
                res
                    .status(409)
                    .json({ message: `Paciente con DNI ${patient.dni} ya registrado.` });
                return;
            }
            /* CREAMOS UN NUEVO ID */
            const newObjId = new mongodb_1.ObjectId();
            /* CONSERVAMOS EL ID DE LA CAMA DEL BODY */
            const tmp = patient.stretcherId;
            /* ASIGNAMOS EL ID NUEVO SOLO PARA VALIDAR EL BODY */
            patient.stretcherId = tmp === 'auto' ? newObjId : tmp;
            /* VALIDAMOS EL BODY */
            const error = new Patient_model_1.default(patient).validateSync();
            if (error) {
                res.status(400).json({ message: error.message });
                return;
            }
            /* ASIGNAMOS EL ID ORIGINAL DEL BODY */
            patient.stretcherId = tmp;
            const patientWithDni = yield new Patient_dao_1.default().getByDNI(patient.dni);
            if (patientWithDni) {
                res.status(409).json({ message: 'DNI ya registrado.' });
                return;
            }
            if (patient.stretcherId === 'auto') {
                /* COMPROBAR CAMAS LIBRES */
                let stretcher = yield new Stretcher_dao_1.default(session).getOneFreeStretcher();
                if (stretcher) {
                    /* CREAR PACIENTE PASANDOLE LA CAMA LIBRE */
                    const createdPatient = yield new Patient_dao_1.default(session).create(Object.assign(Object.assign({}, patient), { stretcherId: stretcher._id }), (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
                    if (!createdPatient)
                        throw new Error('Error al crear paciente.');
                    /* ACTUALIZAR CAMA LIBRE */
                    const updatedStretcher = yield new Stretcher_dao_1.default(session).update(String(stretcher._id), {
                        patientId: createdPatient._id,
                    }, req.session.user._id);
                    if (!updatedStretcher)
                        throw new Error('Error al actualizar cama.');
                    /* COMMIT */
                    yield session.commitTransaction();
                    res.status(201).json({
                        message: 'Paciente creado exitosamente.',
                        data: createdPatient,
                    });
                    return;
                }
                else {
                    /* CREAR PACIENTE CON ID DE CAMA NO EXISTENTE */
                    const createdPatient = yield new Patient_dao_1.default(session).create(Object.assign(Object.assign({}, patient), { stretcherId: newObjId }), (_b = req.session.user) === null || _b === void 0 ? void 0 : _b._id);
                    if (!createdPatient)
                        throw new Error('Error al crear paciente.');
                    /* CREAR CAMA CON ID NO EXISTENTE */
                    stretcher = yield new Stretcher_dao_1.default(session).create({
                        _id: newObjId,
                        patientId: createdPatient._id,
                    }, req.session.user._id);
                    if (!stretcher)
                        throw new Error('Error al crear camilla.');
                    /* COMMIT */
                    yield session.commitTransaction();
                    res.status(201).json({
                        message: 'Paciente creado exitosamente.',
                        data: createdPatient,
                    });
                    return;
                }
            }
            if (patient.stretcherId === null) {
                /* CREAR PACIENTE SIN CAMA */
                const createdPatient = yield new Patient_dao_1.default(session).create(patient, (_c = req.session.user) === null || _c === void 0 ? void 0 : _c._id);
                if (!createdPatient)
                    throw new Error('Error al crear paciente.');
                /* COMMIT */
                yield session.commitTransaction();
                res.status(201).json({
                    message: 'Paciente creado exitosamente.',
                    data: createdPatient,
                });
                return;
            }
            if (mongodb_1.ObjectId.isValid(patient.stretcherId)) {
                /* COMPROBAR EXISTENCIA */
                const stretcherExist = yield new Stretcher_dao_1.default().getById(patient.stretcherId);
                if (!stretcherExist) {
                    res.status(404).json({ message: 'Cama no encontrada.' });
                    return;
                }
                /* CREAR PACIENTE */
                const createdPatient = yield new Patient_dao_1.default(session).create(Object.assign(Object.assign({}, patient), { stretcherId: stretcherExist._id }), (_d = req.session.user) === null || _d === void 0 ? void 0 : _d._id);
                if (!createdPatient)
                    throw new Error('Error al crear paciente.');
                /* ACTUALIZAR CAMA */
                const updatedStretcher = yield new Stretcher_dao_1.default(session).update(String(stretcherExist._id), {
                    patientId: createdPatient._id,
                }, req.session.user._id);
                if (!updatedStretcher)
                    throw new Error('Error al actualizar cama.');
                /* COMMIT */
                yield session.commitTransaction();
                res.status(201).json({
                    message: 'Paciente creado exitosamente.',
                    data: createdPatient,
                });
            }
            else {
                res.status(400).json({ message: 'Id de camilla inválido.' });
                return;
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
    update: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const req = request;
        const { id } = req.params;
        const tmPatient = req.body;
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            // POR ALGUNA RAZON SI NO SE HACE ESTO, NO SE PUEDE HACER EL COMMIT MAS ADELANTE
            // await session.commitTransaction()
            if (!tmPatient || Object.keys(tmPatient).length === 0) {
                res.status(400).json({
                    message: 'No se ha proporcionado la información del paciente.',
                });
                return;
            }
            else if (!tmPatient.stretcherId && tmPatient.stretcherId !== null) {
                res.status(400).json({ message: 'Id de cama no proporcionado.' });
                return;
            }
            const existPatient = yield new Patient_dao_1.default().getById(id);
            if (!existPatient) {
                res.status(404).json({ message: 'Paciente no encontrado.' });
                return;
            }
            const handleUpdate = (patient) => __awaiter(void 0, void 0, void 0, function* () {
                var _f;
                /* VALIDACION DE ESQUEMA */
                const error = new Patient_model_1.default(patient).validateSync();
                if (error)
                    throw new Error(error.message);
                /* ACTUALIZAR PACIENTE */
                const updatedPatient = yield new Patient_dao_1.default(session).update(id, patient, (_f = req.session.user) === null || _f === void 0 ? void 0 : _f._id);
                if (!updatedPatient)
                    throw new Error('Error al actualizar paciente.');
                return updatedPatient;
            });
            if (existPatient.stretcherId !== tmPatient.stretcherId &&
                ((_e = existPatient.stretcherId) === null || _e === void 0 ? void 0 : _e.toString()) !== tmPatient.stretcherId) {
                /**
                 * FALTA MANEJAR SI ES NULL O 'AUTO'
                 */
                if (tmPatient.stretcherId === 'auto') {
                    if (existPatient.stretcherId) {
                        /* JUNTAMOS LOS OBJETOS */
                        const patient = Object.assign(Object.assign({}, existPatient), tmPatient);
                        /**
                         * COMO EL PACIENTE ACTUAL YA TIENE UNA CAMA ASIGNADA
                         * Y SE QUIERE CAMBIAR A 'AUTO', SE DEBE SOLO ESE CAMBIO
                         * POR LO QUE DESPUES DE JUNTAR LOS OBJETOS, SE DEBE
                         * REASIGNAR EL ID DE LA CAMA
                         */
                        patient.stretcherId = existPatient.stretcherId;
                        /* ACTUALIZAMOS CON LOS NUEVOS DATOS DEL PACIENTE */
                        const updatedPatient = yield handleUpdate(patient);
                        if (!updatedPatient) {
                            yield session.abortTransaction();
                            res.status(500).json({ message: 'Error al actualizar paciente.' });
                            return;
                        }
                        /* COMMIT */
                        yield session.commitTransaction();
                        res.status(200).json({
                            message: 'Paciente actualizado exitosamente.',
                            data: updatedPatient,
                        });
                        return;
                    }
                    else {
                        const freeStretcher = yield new Stretcher_dao_1.default(session).getOneFreeStretcher();
                        if (freeStretcher) {
                            const patient = Object.assign(Object.assign({}, existPatient), tmPatient);
                            patient.stretcherId = freeStretcher._id;
                            const updatedPatient = yield handleUpdate(patient);
                            if (!updatedPatient) {
                                yield session.abortTransaction();
                                res
                                    .status(500)
                                    .json({ message: 'Error al actualizar paciente.' });
                                return;
                            }
                            const updatedStretcher = yield new Stretcher_dao_1.default(session).update(String(freeStretcher._id), {
                                patientId: updatedPatient._id,
                            }, req.session.user._id);
                            if (!updatedStretcher) {
                                yield session.abortTransaction();
                                res.status(500).json({ message: 'Error al actualizar cama.' });
                                return;
                            }
                            yield session.commitTransaction();
                            res.status(200).json({
                                message: 'Paciente actualizado exitosamente.',
                                data: updatedPatient,
                            });
                            return;
                        }
                        else {
                            const newId = new mongodb_1.ObjectId();
                            const patient = Object.assign(Object.assign({}, existPatient), tmPatient);
                            patient.stretcherId = newId.toString();
                            const updatedPatient = yield handleUpdate(patient);
                            if (!updatedPatient) {
                                yield session.abortTransaction();
                                res
                                    .status(500)
                                    .json({ message: 'Error al actualizar paciente.' });
                                return;
                            }
                            const stretcher = yield new Stretcher_dao_1.default(session).create({
                                _id: newId,
                                patientId: existPatient._id,
                            }, req.session.user._id);
                            if (!stretcher) {
                                yield session.abortTransaction();
                                res.status(500).json({ message: 'Error al crear camilla.' });
                                return;
                            }
                            yield session.commitTransaction();
                            res.status(200).json({
                                message: 'Paciente actualizado exitosamente.',
                                data: updatedPatient,
                            });
                            return;
                        }
                    }
                }
                else if (tmPatient.stretcherId === null) {
                    const patient = Object.assign(Object.assign({}, existPatient), tmPatient);
                    const updatedPatient = yield handleUpdate(patient);
                    if (!updatedPatient) {
                        yield session.abortTransaction();
                        res.status(500).json({ message: 'Error al actualizar paciente.' });
                        return;
                    }
                    const deletedStretcher = yield new Stretcher_dao_1.default(session).delete(String(existPatient.stretcherId), req.session.user._id);
                    if (!deletedStretcher) {
                        yield session.abortTransaction();
                        res.status(500).json({ message: 'Error al eliminar la camilla.' });
                        return;
                    }
                    yield session.commitTransaction();
                    res.status(200).json({
                        message: 'Paciente actualizado exitosamente.',
                        data: updatedPatient,
                    });
                    return;
                }
                else {
                    if (!mongodb_1.ObjectId.isValid(tmPatient.stretcherId)) {
                        res.status(400).json({ message: 'Id de cama inválido.' });
                        return;
                    }
                    const stretcher = yield new Stretcher_dao_1.default().getById(tmPatient.stretcherId);
                    if (!stretcher || stretcher.isDeleted) {
                        res.status(404).json({ message: 'Cama no encontrada.' });
                        return;
                    }
                    else if (stretcher.patientId) {
                        res.status(409).json({ message: 'Cama ocupada.' });
                        return;
                    }
                    const patient = Object.assign(Object.assign({}, existPatient), tmPatient);
                    const updatedPatient = yield handleUpdate(patient);
                    if (!updatedPatient) {
                        yield session.abortTransaction();
                        res.status(500).json({ message: 'Error al actualizar paciente.' });
                        return;
                    }
                    const updatedStretcher = yield new Stretcher_dao_1.default(session).update(String(stretcher._id), {
                        patientId: updatedPatient._id,
                    }, req.session.user._id);
                    if (!updatedStretcher) {
                        yield session.abortTransaction();
                        res.status(500).json({ message: 'Error al actualizar cama.' });
                        return;
                    }
                    /**
                     * NO PUEDE EXISTIR UNA CAMA SIN UN PACIENTE ASIGNADO
                     * POR LO QUE SE ELIMINA LA CAMA
                     */
                    if (existPatient.stretcherId) {
                        const deletedStretcher = yield new Stretcher_dao_1.default(session).delete(String(existPatient.stretcherId), req.session.user._id);
                        if (!deletedStretcher) {
                            yield session.abortTransaction();
                            res.status(500).json({ message: 'Error al eliminar la camilla.' });
                            return;
                        }
                    }
                    yield session.commitTransaction();
                    res.status(200).json({
                        message: 'Paciente actualizado exitosamente.',
                        data: updatedPatient,
                    });
                    return;
                }
            }
            else {
                const patient = Object.assign(Object.assign({}, existPatient), tmPatient);
                /* ACTUALIZAMOS CON LOS NUEVOS DATOS DEL PACIENTE */
                const updatedPatient = yield handleUpdate(patient);
                if (!updatedPatient) {
                    yield session.abortTransaction();
                    res.status(500).json({ message: 'Error al actualizar paciente.' });
                    return;
                }
                /* COMMIT */
                yield session.commitTransaction();
                res.status(200).json({
                    message: 'Paciente actualizado exitosamente.',
                    data: updatedPatient,
                });
                return;
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
    delete: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _g;
        const req = request;
        const { id } = req.params;
        try {
            if (!id) {
                res.status(400).json({ message: 'DNI no proporcionado.' });
                return;
            }
            const patient = (yield new Patient_dao_1.default().getById(id));
            if (!patient) {
                res.status(404).json({ message: 'Paciente no encontrado.' });
                return;
            }
            else if (patient.laboratoryId) {
                res.status(409).json({
                    message: 'El paciente que intenta eliminar tiene un laboratorio asignado. Primero debe eliminar el laboratorio.',
                });
                return;
            }
            else if (patient.stretcherId) {
                res.status(409).json({
                    message: 'El paciente que intenta eliminar tiene una cama asignada. Primero debe eliminar la cama.',
                });
                return;
            }
            const deletedPatient = yield new Patient_dao_1.default().delete(patient._id, (_g = req.session.user) === null || _g === void 0 ? void 0 : _g._id);
            if (!deletedPatient)
                throw new Error('Error al eliminar paciente.');
            if (deletedPatient.stretcherId) {
                yield new Stretcher_dao_1.default().update(String(deletedPatient.stretcherId), {
                    patientId: null,
                }, req.session.user._id);
            }
            res.status(200).json({
                message: 'Paciente eliminado exitosamente.',
                data: deletedPatient,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
