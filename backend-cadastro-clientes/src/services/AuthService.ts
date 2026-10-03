/**
 * AuthService.ts
 * Contém lógica de autenticação: registro, login, refresh token, esqueci senha.
 */
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { gerarTokenAcesso, gerarRefreshToken } from "../utils/jwt";
import { gerarCodigoNumerico } from "../utils/geradorCodigo";
export enum Role {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN"
}
import { enviarEmailCodigo } from "./EmailService";
import dotenv from "dotenv";
dotenv.config();

/**
 * cadastrarUsuario
 * Cria um usuário e, opcionalmente, um cliente associado.
 */
export async function cadastrarUsuario(email: string, senha: string, nome: string, role: Role = Role.CLIENTE) {
  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: {
      email,
      senha: senhaHash,
      nome,
      role // agora é do tipo Role
    }
  });
  return usuario;
}

/** Hash simples para refresh tokens */
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * autenticarUsuario
 * Verifica credenciais e retorna tokens (acesso + refresh).
 */
export async function autenticarUsuario(email: string, senha: string) {
  // 1) buscar apenas hash da senha para validação
  const usuarioComSenha = await prisma.usuario.findUnique({
    where: { email },
    select: { id: true, senha: true }
  });
  if (!usuarioComSenha) throw new Error("Usuário não encontrado");

  const senhaValida = await bcrypt.compare(senha, usuarioComSenha.senha);
  if (!senhaValida) throw new Error("Senha inválida");

  // 2) buscar dados públicos do usuário (sem senha)
  const usuarioPublico = await prisma.usuario.findUnique({
    where: { id: usuarioComSenha.id },
    select: { id: true, email: true, nome: true, role: true, clienteId: true }
  });
  if (!usuarioPublico) throw new Error("Usuário não encontrado");

  // 3) gerar tokens
  const payload = { id: usuarioPublico.id, role: usuarioPublico.role };
  const tokenAcesso = gerarTokenAcesso(payload);
  const tokenRefresh = gerarRefreshToken({ id: usuarioPublico.id });

  // 4) salvar hash do refresh token no banco
  const tokenRefreshHash = hashToken(tokenRefresh);
  const expiracao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
  await prisma.refreshToken.create({
    data: {
      token: tokenRefreshHash,
      usuarioId: usuarioPublico.id,
      expiracao
    }
  });

  // 5) retornar apenas dados não sensíveis
  return {
    tokenAcesso,
    tokenRefresh,
    usuario: {
      id: usuarioPublico.id,
      nome: usuarioPublico.nome,
      role: usuarioPublico.role,
      clienteId: usuarioPublico.clienteId
    }
  };
}

/**
 * renovarToken
 * Recebe um refresh token válido e emite novo token de acesso.
 */
export async function renovarToken(tokenRefresh: string) {
  const registro = await prisma.refreshToken.findUnique({ where: { token: tokenRefresh } });
  if (!registro) throw new Error("Refresh token inválido");
  if (registro.expiracao < new Date()) {
    await prisma.refreshToken.delete({ where: { id: registro.id } });
    throw new Error("Refresh token expirado");
  }
  const usuario = await prisma.usuario.findUnique({ where: { id: registro.usuarioId } });
  if (!usuario) throw new Error("Usuário não encontrado");

  const payload = { id: usuario.id, email: usuario.email, role: usuario.role };
  const tokenAcesso = gerarTokenAcesso(payload);
  return { tokenAcesso };
}

/**
 * iniciarRecuperacaoSenha
 * Gera um código, salva e envia por e-mail para o usuário.
 */
export async function iniciarRecuperacaoSenha(email: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error("Usuário não encontrado");

  const codigo = gerarCodigoNumerico(6);
  const expiracao = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

  // Upsert do código de recuperação
  await prisma.codigoRecuperacao.upsert({
    where: { usuarioId: usuario.id },
    update: { codigo, expiracao },
    create: { codigo, expiracao, usuarioId: usuario.id }
  });

  await enviarEmailCodigo(email, codigo);
  return { mensagem: "Código enviado por e-mail" };
}

/**
 * confirmarRecuperacaoSenha
 * Verifica código e atualiza a senha do usuário.
 */
export async function confirmarRecuperacaoSenha(email: string, codigo: string, novaSenha: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email }, include: { codigoRecuperacao: true } });
  if (!usuario || !usuario.codigoRecuperacao) throw new Error("Código inválido");
  if (usuario.codigoRecuperacao.codigo !== codigo) throw new Error("Código inválido");
  if (usuario.codigoRecuperacao.expiracao < new Date()) throw new Error("Código expirado");

  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.usuario.update({ where: { id: usuario.id }, data: { senha: senhaHash } });
  await prisma.codigoRecuperacao.delete({ where: { id: usuario.codigoRecuperacao.id } });

  return { mensagem: "Senha atualizada com sucesso" };
}
