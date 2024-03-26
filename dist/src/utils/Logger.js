"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Logger {
    constructor() {
        this.path = path_1.default.join(process.cwd(), process.env.LOG_FOLDER_NAME || 'logs');
        if (Logger.instance)
            return Logger.instance;
        Logger.instance = this;
    }
    log(message) {
        if (!fs_1.default.existsSync(this.path))
            fs_1.default.mkdirSync(this.path);
        const filename = `${Date.now()}.log`;
        const filepath = path_1.default.join(this.path, filename);
        fs_1.default.writeFile(filepath, message, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.info('\x1b[34m' +
                    `[INFO] Error logged with filename: ${filename}` +
                    '\x1b[0m');
            }
        });
    }
}
exports.default = Logger;
