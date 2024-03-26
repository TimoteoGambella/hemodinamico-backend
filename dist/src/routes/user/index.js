"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_model_1 = __importDefault(require("../../db/model/User.model"));
const user_controller_1 = __importDefault(require("./controller/user.controller"));
const validateAdmin_1 = __importDefault(require("../middleware/validateAdmin"));
const validateSchema_1 = __importDefault(require("../middleware/validateSchema"));
const router = express_1.default.Router();
router.get('/list', validateAdmin_1.default, user_controller_1.default.getAll);
router.post('/create', (0, validateSchema_1.default)(User_model_1.default), user_controller_1.default.register);
router.delete('/delete/:username', validateAdmin_1.default, user_controller_1.default.delete);
exports.default = router;
