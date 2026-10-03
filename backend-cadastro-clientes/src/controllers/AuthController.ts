/**
 * AuthController.ts
 * Controlador com endpoints de autenticação: register, login, refresh, forgot password.
 */
import { Request, Response } from "express";
import * as AuthService from "../services/AuthService";

/**
 * registrar
 * Endpoint para registrar novo usuário.
 */
export async function registrar(req: Request, res: Response) {
  try {
    const { email, senha, nome, role } = req.body;
    const usuario = await AuthService.cadastrarUsuario(email, senha, nome, role);
    return res.status(201).json(usuario);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}

/**
 * login
 * Endpoint para autenticar usuário e retornar tokens.
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    const resultado = await AuthService.autenticarUsuario(email, senha);
    return res.json(resultado);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}

/**
 * refreshToken
 * Endpoint para renovar token de acesso usando refresh token.
 */
export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    const resultado = await AuthService.renovarToken(refreshToken);
    return res.json(resultado);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}

/**
 * esqueciSenha
 * Inicia fluxo de recuperação de senha (envia código por e-mail).
 */
export async function esqueciSenha(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const resultado = await AuthService.iniciarRecuperacaoSenha(email);
    return res.json(resultado);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}

/**
 * confirmarRecuperacao
 * Confirma código e altera senha.
 */
export async function confirmarRecuperacao(req: Request, res: Response) {
  try {
    const { email, codigo, novaSenha } = req.body;
    const resultado = await AuthService.confirmarRecuperacaoSenha(email, codigo, novaSenha);
    return res.json(resultado);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}
