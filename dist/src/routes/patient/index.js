"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controller_1 = __importDefault(require("./controller/patient.controller"));
const router = express_1.default.Router();
router.get('/list', patient_controller_1.default.getAll);
router.post('/create', patient_controller_1.default.register);
router.patch('/update/:id', patient_controller_1.default.update);
router.delete('/delete/:id', patient_controller_1.default.delete);
exports.default = router;
