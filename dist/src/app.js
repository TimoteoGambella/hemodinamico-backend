"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_config_1 = __importStar(require("./config/cors.config"));
const cookieSession_config_1 = __importDefault(require("./config/cookieSession.config"));
const dbConnection_config_1 = require("./config/dbConnection.config");
const handleInternalError_1 = __importDefault(require("./utils/handleInternalError"));
const morgan_config_1 = __importDefault(require("./config/morgan.config"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, dbConnection_config_1.initDBConnection)()
    .then(() => {
    app.use((0, morgan_config_1.default)());
    app.use((0, cors_config_1.default)());
    app.use(express_1.default.json());
    app.set('trust proxy', 1);
    app.use((0, cookieSession_config_1.default)());
    app.use('/api', routes_1.default);
    app.use('*', (_req, res) => res.status(404).json({
        message: 'Route not found!',
    }));
    app.use(handleInternalError_1.default);
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        const address = server.address();
        const host = address.address === '::' ? 'localhost' : address.address;
        const protocol = process.env.NODE_ENV === 'prod' ? 'https' : 'http';
        const port = address.port;
        console.info('\x1b[34m' + `[INFO] ALLOWED ORIGINS: ${cors_config_1.ALLOWED_ORIGINS}` + '\x1b[0m');
        console.info('\x1b[34m' +
            `[INFO] Server is running on ${protocol}://${host}:${port}` +
            '\x1b[0m');
    });
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
exports.default = app;
