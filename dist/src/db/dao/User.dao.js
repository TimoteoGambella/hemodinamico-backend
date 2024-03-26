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
const mongodb_1 = require("mongodb");
const User_model_1 = __importDefault(require("../model/User.model"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
class UserDAO {
    constructor() {
        this.logger = new Logger_1.default();
    }
    handleError(error) {
        this.logger.log(error.stack || error.toString());
        return null;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.default.find({ isDeleted: false }).select('-password -__v');
                return users;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    getByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.findOne({
                    username,
                    isDeleted: false,
                }).select('-__v');
                return user;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new User_model_1.default(user);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    delete(username, deletedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield User_model_1.default.findOneAndUpdate({ username }, {
                    isDeleted: true,
                    deletedAt: Date.now(),
                    username: new mongodb_1.ObjectId().toString(),
                    deletedBy,
                });
                return deletedUser;
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
}
exports.default = UserDAO;
