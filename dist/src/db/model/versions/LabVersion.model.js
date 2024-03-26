"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LabSchema_1 = __importDefault(require("../schemas/LabSchema"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const labVersionSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, LabSchema_1.default), { editedBy: { type: mongodb_1.ObjectId, required: true, ref: 'users', inmutable: true }, refId: {
        type: mongodb_1.ObjectId,
        ref: 'laboratories',
        required: true,
        inmutable: true,
    }, __v: {
        type: Number,
        required: true,
        inmutable: true,
    } }), {
    versionKey: false
});
const LabVersionsModel = mongoose_1.default.model('laboratory_versions', labVersionSchema);
exports.default = LabVersionsModel;
