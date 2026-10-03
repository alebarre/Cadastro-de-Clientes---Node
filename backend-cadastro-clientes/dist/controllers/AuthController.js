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
exports.registrar = registrar;
exports.login = login;
exports.refreshToken = refreshToken;
exports.esqueciSenha = esqueciSenha;
exports.confirmarRecuperacao = confirmarRecuperacao;
const AuthService = __importStar(require("../services/AuthService"));
/**
 * registrar
 * Endpoint para registrar novo usuário.
 */
async function registrar(req, res) {
    try {
        const { email, senha, nome, role } = req.body;
        const usuario = await AuthService.cadastrarUsuario(email, senha, nome, role);
        return res.status(201).json(usuario);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
/**
 * login
 * Endpoint para autenticar usuário e retornar tokens.
 */
async function login(req, res) {
    try {
        const { email, senha } = req.body;
        const resultado = await AuthService.autenticarUsuario(email, senha);
        return res.json(resultado);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
/**
 * refreshToken
 * Endpoint para renovar token de acesso usando refresh token.
 */
async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        const resultado = await AuthService.renovarToken(refreshToken);
        return res.json(resultado);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
/**
 * esqueciSenha
 * Inicia fluxo de recuperação de senha (envia código por e-mail).
 */
async function esqueciSenha(req, res) {
    try {
        const { email } = req.body;
        const resultado = await AuthService.iniciarRecuperacaoSenha(email);
        return res.json(resultado);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
/**
 * confirmarRecuperacao
 * Confirma código e altera senha.
 */
async function confirmarRecuperacao(req, res) {
    try {
        const { email, codigo, novaSenha } = req.body;
        const resultado = await AuthService.confirmarRecuperacaoSenha(email, codigo, novaSenha);
        return res.json(resultado);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
