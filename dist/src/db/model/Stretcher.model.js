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
const StretcherSchema_1 = __importDefault(require("./schemas/StretcherSchema"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const stretcherSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, StretcherSchema_1.default), { isDeleted: {
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
stretcherSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew && !this.label) {
            const num = yield this.model('stretchers').countDocuments();
            this.label = 'Monitoreo ' + (num + 1);
        }
        next();
    });
});
const StretcherModel = mongoose_1.default.model('stretchers', stretcherSchema);
exports.default = StretcherModel;
