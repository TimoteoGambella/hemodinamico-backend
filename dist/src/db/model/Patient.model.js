"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PatientSchema_1 = __importDefault(require("./schemas/PatientSchema"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const patientSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, PatientSchema_1.default), { isDeleted: {
        type: Boolean,
        required: false,
        default: false,
    }, deletedBy: {
        type: mongodb_1.ObjectId,
        required: false,
        ref: 'users',
    }, deletedAt: {
        type: Number,
        required: false,
    } }));
const PatientModel = mongoose_1.default.model('patients', patientSchema);
exports.default = PatientModel;
