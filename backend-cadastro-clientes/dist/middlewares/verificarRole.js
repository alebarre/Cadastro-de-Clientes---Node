"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarRole = verificarRole;
function verificarRole(rolesPermitidas) {
    return (req, res, next) => {
        const usuario = req.usuario;
        if (!usuario)
            return res.status(401).json({ erro: "Usuário não autenticado" });
        // valida se role existe e é string
        const roleUsuario = typeof usuario.role === "string" ? usuario.role : undefined;
        if (!roleUsuario)
            return res.status(403).json({ erro: "Acesso negado" });
        if (!rolesPermitidas.includes(roleUsuario))
            return res.status(403).json({ erro: "Acesso negado" });
        next();
    };
}
