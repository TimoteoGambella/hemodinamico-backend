"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (shoudBeLogged) => (req, res, next) => {
    var _a, _b;
    if (shoudBeLogged && !((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
        res.status(401).json({
            message: 'La autenticación es requerida para acceder a este recurso.',
        });
        return;
    }
    else if (!shoudBeLogged && ((_b = req.session) === null || _b === void 0 ? void 0 : _b.user)) {
        res.status(403).json({
            message: 'Para acceder a este recurso no debes estar autenticado.',
        });
        return;
    }
    next();
};
