"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./Logger"));
const logger = new Logger_1.default();
exports.default = (error, _req, res, _next) => {
    logger.log(error.stack || error.message);
    res.status(500).json({
        message: 'Internal server error',
    });
};
