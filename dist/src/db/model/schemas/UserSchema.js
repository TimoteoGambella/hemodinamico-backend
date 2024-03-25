"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
exports.default = {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createAt: {
        type: Number,
        required: false,
        default: () => Date.now(),
        immutable: true,
    },
    deletedBy: {
        type: mongodb_1.ObjectId,
        ref: 'users',
        required: false,
    },
    deletedAt: {
        type: Number,
    },
};
