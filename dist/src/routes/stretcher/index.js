"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Stretcher_model_1 = __importDefault(require("../../db/model/Stretcher.model"));
const stretcher_controller_1 = __importDefault(require("./controller/stretcher.controller"));
const validateSchema_1 = __importDefault(require("../middleware/validateSchema"));
const router = express_1.default.Router();
router.get('/list', stretcher_controller_1.default.getAll);
router.get('/:id', stretcher_controller_1.default.getOne);
router.get('/list/versions', stretcher_controller_1.default.getAllVersions);
router.get('/list/versions/:id', stretcher_controller_1.default.getVersionsById);
router.patch('/update/:id', (0, validateSchema_1.default)(Stretcher_model_1.default), stretcher_controller_1.default.update);
router.delete('/delete/:id', stretcher_controller_1.default.delete);
exports.default = router;
