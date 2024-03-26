"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_ORIGINS = void 0;
const cors_1 = __importDefault(require("cors"));
exports.ALLOWED_ORIGINS = (_a = process.env.CLIENT_URL) === null || _a === void 0 ? void 0 : _a.split(',').map((url) => url.trim());
function corsConfig() {
    if (!exports.ALLOWED_ORIGINS)
        throw new Error('CLIENT_URL is not defined');
    return (0, cors_1.default)({
        origin: exports.ALLOWED_ORIGINS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'PREFLIGHT'],
        credentials: true,
    });
}
exports.default = corsConfig;
