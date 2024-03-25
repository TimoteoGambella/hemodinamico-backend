"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
exports.default = {
    label: { type: String, required: false },
    patientId: {
        type: Object,
        required: false,
        default: null,
    },
    patientHeartRate: { type: Number, required: false, default: null },
    aid: {
        type: [String],
        required: false,
        default: ['ecmo'],
    },
    suministros: {
        type: Object,
        required: false,
        default: {
            drogas: [],
        },
    },
    diagnostic: {
        type: Object,
        required: false,
        default: {
            type: null,
            subtype: null,
        },
    },
    muestra: {
        type: Object,
        required: false,
        default: {
            arteria: {
                lactato: null,
                pC02: null,
                sat: null,
            },
            vena: {
                pC02: null,
                sat: null,
            },
        },
    },
    cateter: {
        type: Object,
        required: false,
        default: {
            PAP: {
                diastolica: null,
                sistolica: null,
            },
            gasto: null,
            presion: {
                AD: null,
                capilar: null,
                mediaSistemica: null,
            },
        },
    },
    fick: {
        type: Object,
        required: false,
        default: {
            hemoglobina: null,
        },
    },
    editedBy: {
        type: mongodb_1.ObjectId,
        ref: 'users',
        required: false,
    },
    editedAt: {
        type: Number,
        required: false,
        default: null,
        inmutable: true,
    },
    createdAt: {
        type: Number,
        required: false,
        default: () => Date.now(),
        immutable: true,
    },
};
