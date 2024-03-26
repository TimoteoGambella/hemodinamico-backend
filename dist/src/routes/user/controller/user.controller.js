"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_dao_1 = __importDefault(require("../../../db/dao/User.dao"));
exports.default = {
    getAll: (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield new User_dao_1.default().getAll();
            if (!users)
                throw new Error('Error al obtener usuarios.');
            res.status(200).json({ message: 'Get all users', data: users });
        }
        catch (error) {
            next(error);
        }
    }),
    register: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body;
        try {
            const createdUser = yield new User_dao_1.default().create(user);
            if (!createdUser)
                throw new Error('Error al crear usuario.');
            res.status(201).json({
                message: 'Usuario creado exitosamente.',
                data: createdUser,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    delete: (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const req = request;
        const { username } = req.params;
        try {
            const user = yield new User_dao_1.default().getByUsername(username);
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado.' });
                return;
            }
            const deletedUser = yield new User_dao_1.default().delete(user.username, (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
            if (!deletedUser)
                throw new Error('Error al eliminar usuario.');
            res.status(200).json({
                message: 'Usuario eliminado exitosamente.',
                data: deletedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
