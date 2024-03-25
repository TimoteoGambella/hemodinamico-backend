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
    userInfo: (request, res, next) => {
        const req = request;
        try {
            res.json(req.session.user);
        }
        catch (error) {
            next(error);
        }
    },
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            const handleInvalid = (status) => res.status(status).json({
                message: 'El usuario o la contraseña son inválidos.',
            });
            if (username && password) {
                const user = yield new User_dao_1.default().getByUsername(username);
                if (!user || !(yield user.isValidPassword(password))) {
                    handleInvalid(401);
                    return;
                }
                const tmp = JSON.parse(JSON.stringify(user));
                delete tmp.password;
                req.session.user = tmp;
                res.json({
                    message: 'Inicio de sesión exitoso.',
                    user: tmp,
                });
            }
            else {
                handleInvalid(400);
            }
        }
        catch (error) {
            next(error);
        }
    }),
    logout: (req, res, next) => {
        try {
            req.session = null;
            res.json({
                message: 'Cierre de sesión exitoso.',
            });
        }
        catch (error) {
            next(error);
        }
    },
    session: (request, res, next) => {
        const req = request;
        try {
            if (req.session && req.session.user) {
                res.status(200).end();
            }
            else {
                res.status(401).end();
            }
        }
        catch (error) {
            next(error);
        }
    }
};
