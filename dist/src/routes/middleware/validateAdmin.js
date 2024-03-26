"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    var _a;
    if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        res.status(403).json({
            message: 'No tienes permisos para acceder a este recurso.',
        });
        return;
    }
    next();
};
