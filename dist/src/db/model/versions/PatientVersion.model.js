"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PatientSchema_1 = __importDefault(require("../schemas/PatientSchema"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const patientVersionSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, PatientSchema_1.default), { dni: {
        type: Number,
        required: true,
        unique: false,
    }, editedBy: { type: mongodb_1.ObjectId, required: true, ref: 'users', inmutable: true }, refId: {
        type: mongodb_1.ObjectId,
        ref: 'patients',
        required: true,
        inmutable: true,
    }, __v: {
        type: Number,
        required: true,
        inmutable: true,
    } }), {
    versionKey: false,
});
const PatientVersionModel = mongoose_1.default.model('patients_versions', patientVersionSchema);
exports.default = PatientVersionModel;
