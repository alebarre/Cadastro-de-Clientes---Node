/**
 * verificarRole.ts
 * Middleware que verifica se o usuário possui uma das roles permitidas.
 */
import { Request, Response, NextFunction } from "express";
import { RequestComUsuario } from "./autenticarJWT";

export function verificarRole(rolesPermitidas: string[]) {
  return (req: RequestComUsuario, res: Response, next: NextFunction) => {
    const usuario = req.usuario;
    if (!usuario) return res.status(401).json({ erro: "Usuário não autenticado" });

    // valida se role existe e é string
    const roleUsuario = typeof usuario.role === "string" ? usuario.role : undefined;
    if (!roleUsuario) return res.status(403).json({ erro: "Acesso negado" });

    if (!rolesPermitidas.includes(roleUsuario)) return res.status(403).json({ erro: "Acesso negado" });
    next();
  };
}
