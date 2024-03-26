"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Laboratory_model_1 = __importDefault(require("../../db/model/Laboratory.model"));
const laboratory_controller_1 = __importDefault(require("./controller/laboratory.controller"));
const validateSchema_1 = __importDefault(require("../middleware/validateSchema"));
const router = express_1.default.Router();
router.get('/list', laboratory_controller_1.default.getAll);
router.get('/:id', laboratory_controller_1.default.getById);
router.get('/list/versions', laboratory_controller_1.default.getAllVersions);
router.get('/list/versions/:id', laboratory_controller_1.default.getVersionsById);
router.post('/create', (0, validateSchema_1.default)(Laboratory_model_1.default), laboratory_controller_1.default.create);
router.patch('/update/:id', laboratory_controller_1.default.update);
router.delete('/delete/:id', laboratory_controller_1.default.delete);
exports.default = router;
