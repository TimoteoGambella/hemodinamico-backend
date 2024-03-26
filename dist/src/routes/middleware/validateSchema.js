"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateSchema(modelClass) {
    return (req, res, next) => {
        try {
            const user = req.body;
            const instance = new modelClass(user);
            const isValid = instance.validateSync();
            if (isValid) {
                res.status(400).json({
                    message: 'Estructura de datos de usuario inválida.',
                    error: isValid.errors,
                });
                return;
            }
            else {
                next();
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Server error',
            });
        }
    };
}
exports.default = validateSchema;
