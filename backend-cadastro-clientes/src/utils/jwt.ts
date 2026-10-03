/**
 * jwt.ts
 * Funções utilitárias para gerar e verificar tokens JWT e refresh tokens.
 */
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET: Secret = (process.env.JWT_SECRET as string) || "secret";
const JWT_EXPIRES_IN: number | StringValue = (process.env.JWT_EXPIRES_IN as StringValue) || "15m";
const REFRESH_SECRET: Secret = (process.env.REFRESH_TOKEN_SECRET as string) || "refresh_secret";
const REFRESH_EXPIRES_IN: number | StringValue = (process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue) || "7d";

/**
 * gerarTokenAcesso
 * Gera um token JWT de acesso com payload e tempo de expiração.
 */
export function gerarTokenAcesso(payload: object) {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload as string | object | Buffer, JWT_SECRET, options);
}

/**
 * verificarTokenAcesso
 * Verifica e decodifica um token JWT de acesso.
 */
export function verificarTokenAcesso(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * gerarRefreshToken
 * Gera um refresh token assinado.
 */
export function gerarRefreshToken(payload: object) {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN };
  return jwt.sign(payload as string | object | Buffer, REFRESH_SECRET, options);
}

/**
 * verificarRefreshToken
 * Verifica e decodifica um refresh token.
 */
export function verificarRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
