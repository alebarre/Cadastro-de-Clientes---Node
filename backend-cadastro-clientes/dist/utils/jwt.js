"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarTokenAcesso = gerarTokenAcesso;
exports.verificarTokenAcesso = verificarTokenAcesso;
exports.gerarRefreshToken = gerarRefreshToken;
exports.verificarRefreshToken = verificarRefreshToken;
/**
 * jwt.ts
 * Funções utilitárias para gerar e verificar tokens JWT e refresh tokens.
 */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
/**
 * gerarTokenAcesso
 * Gera um token JWT de acesso com payload e tempo de expiração.
 */
function gerarTokenAcesso(payload) {
    const options = { expiresIn: JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
/**
 * verificarTokenAcesso
 * Verifica e decodifica um token JWT de acesso.
 */
function verificarTokenAcesso(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
/**
 * gerarRefreshToken
 * Gera um refresh token assinado.
 */
function gerarRefreshToken(payload) {
    const options = { expiresIn: REFRESH_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET, options);
}
/**
 * verificarRefreshToken
 * Verifica e decodifica um refresh token.
 */
function verificarRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
}
