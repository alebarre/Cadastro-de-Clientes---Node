"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * cliente.routes.ts
 * Rotas para gerenciamento de clientes.
 */
const express_1 = require("express");
const ClienteController = __importStar(require("../controllers/ClienteController"));
const autenticarJWT_1 = require("../middlewares/autenticarJWT");
const verificarRole_1 = require("../middlewares/verificarRole");
const router = (0, express_1.Router)();
router.post("/", autenticarJWT_1.autenticarJWT, (0, verificarRole_1.verificarRole)(["ADMIN", "VENDEDOR"]), ClienteController.cadastrarCliente);
router.get("/", autenticarJWT_1.autenticarJWT, (0, verificarRole_1.verificarRole)(["ADMIN", "VENDEDOR"]), ClienteController.listarClientes);
exports.default = router;
