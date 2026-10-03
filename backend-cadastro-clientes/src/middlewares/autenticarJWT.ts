// src/middlewares/autenticarJWT.ts
import { Request, Response, NextFunction } from "express";
import { verificarTokenAcesso } from "../utils/jwt";

/**
 * RequestComUsuario
 * Extende Request do Express adicionando a propriedade usuario.
 */
export interface RequestComUsuario extends Request {
  usuario?: {
    id?: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

export function autenticarJWT(req: RequestComUsuario, res: Response, next: NextFunction) {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return res.status(401).json({ erro: "Token não fornecido" });
  const token = authHeader.split(" ")[1];
  try {
    const payload: any = verificarTokenAcesso(token);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}
