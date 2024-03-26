"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StretcherSchema_1 = __importDefault(require("../schemas/StretcherSchema"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const stretcherSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, StretcherSchema_1.default), { editedBy: { type: mongodb_1.ObjectId, required: true, ref: 'users', inmutable: true }, patientId: {
        type: Object,
        required: function () { this.patientId === undefined; },
        inmutable: true,
        default: null,
    }, refId: {
        type: mongodb_1.ObjectId,
        ref: 'stretchers',
        required: true,
        inmutable: true,
    }, __v: {
        type: Number,
        required: true,
        inmutable: true,
    } }), {
    versionKey: false,
});
const StretcherModel = mongoose_1.default.model('stretchers_versions', stretcherSchema);
exports.default = StretcherModel;
