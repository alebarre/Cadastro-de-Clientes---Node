"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarJWT = autenticarJWT;
const jwt_1 = require("../utils/jwt");
function autenticarJWT(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader)
        return res.status(401).json({ erro: "Token não fornecido" });
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, jwt_1.verificarTokenAcesso)(token);
        req.usuario = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ erro: "Token inválido" });
    }
}
