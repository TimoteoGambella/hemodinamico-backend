"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./controller/auth.controller"));
const validateAuth_1 = __importDefault(require("../middleware/validateAuth"));
const router = express_1.default.Router();
router.get('/user', (0, validateAuth_1.default)(true), auth_controller_1.default.userInfo);
router.post('/login', (0, validateAuth_1.default)(false), auth_controller_1.default.login);
router.get('/logout', (0, validateAuth_1.default)(true), auth_controller_1.default.logout);
router.get('/session', auth_controller_1.default.session);
exports.default = router;
