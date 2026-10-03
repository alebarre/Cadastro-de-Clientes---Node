"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * index.ts
 * Agrega todas as rotas e configurações de Swagger.
 */
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const cliente_routes_1 = __importDefault(require("./cliente.routes"));
const produto_routes_1 = __importDefault(require("./produto.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/clientes", cliente_routes_1.default);
router.use("/produtos", produto_routes_1.default);
exports.default = router;
