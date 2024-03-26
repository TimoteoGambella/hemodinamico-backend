"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LabSchema_1 = __importDefault(require("./schemas/LabSchema"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const laboratorySchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, LabSchema_1.default), { isDeleted: {
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
const LaboratoryModel = mongoose_1.default.model('laboratories', laboratorySchema);
exports.default = LaboratoryModel;
