"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const patient_1 = __importDefault(require("./patient"));
const stretcher_1 = __importDefault(require("./stretcher"));
const laboratory_1 = __importDefault(require("./laboratory"));
const validateAuth_1 = __importDefault(require("./middleware/validateAuth"));
const validateAdmin_1 = __importDefault(require("./middleware/validateAdmin"));
const exportLogs_1 = __importDefault(require("./middleware/exportLogs"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/user', (0, validateAuth_1.default)(true), user_1.default);
router.use('/patient', (0, validateAuth_1.default)(true), patient_1.default);
router.use('/stretcher', (0, validateAuth_1.default)(true), stretcher_1.default);
router.use('/laboratory', (0, validateAuth_1.default)(true), laboratory_1.default);
router.get('/logs', validateAdmin_1.default, exportLogs_1.default);
exports.default = router;