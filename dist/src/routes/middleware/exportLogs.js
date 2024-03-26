"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const archiver_1 = __importDefault(require("archiver"));
const path_1 = __importDefault(require("path"));
function exportLogs(_req, res) {
    // Creamos un objeto de tipo archiver
    const archive = (0, archiver_1.default)('zip', {
        zlib: { level: 9 }, // Establecemos el nivel de compresión.
    });
    // Este evento se dispara si hay un error en el proceso de compresión.
    archive.on('error', function (err) {
        res.status(500).send({ error: err.message });
    });
    // Establecemos el tipo de respuesta
    res.attachment('log.zip');
    // Establecemos el directorio que queremos comprimir
    archive.directory(path_1.default.join(process.cwd(), process.env.LOG_FOLDER_NAME || 'logs'), false);
    // Enviamos el archivo comprimido al cliente
    archive.pipe(res);
    archive.finalize();
}
exports.default = exportLogs;
