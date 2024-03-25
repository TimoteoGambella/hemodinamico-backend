"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_session_1 = __importDefault(require("cookie-session"));
const ms_1 = __importDefault(require("ms"));
function cookieSessionConfig() {
    return (0, cookie_session_1.default)({
        name: 'session',
        maxAge: (0, ms_1.default)('8h'),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        secret: process.env.SESSION_SECRET || 'secret',
        sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'strict',
    });
}
exports.default = cookieSessionConfig;
