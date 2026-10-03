"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
exports.cadastrarUsuario = cadastrarUsuario;
exports.autenticarUsuario = autenticarUsuario;
exports.renovarToken = renovarToken;
exports.iniciarRecuperacaoSenha = iniciarRecuperacaoSenha;
exports.confirmarRecuperacaoSenha = confirmarRecuperacaoSenha;
/**
 * AuthService.ts
 * Contém lógica de autenticação: registro, login, refresh token, esqueci senha.
 */
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = require("../utils/jwt");
const geradorCodigo_1 = require("../utils/geradorCodigo");
var Role;
(function (Role) {
    Role["CLIENTE"] = "CLIENTE";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
const EmailService_1 = require("./EmailService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * cadastrarUsuario
 * Cria um usuário e, opcionalmente, um cliente associado.
 */
async function cadastrarUsuario(email, senha, nome, role = Role.CLIENTE) {
    const senhaHash = await bcryptjs_1.default.hash(senha, 10);
    const usuario = await prismaClient_1.default.usuario.create({
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
function hashToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
/**
 * autenticarUsuario
 * Verifica credenciais e retorna tokens (acesso + refresh).
 */
async function autenticarUsuario(email, senha) {
    // 1) buscar apenas hash da senha para validação
    const usuarioComSenha = await prismaClient_1.default.usuario.findUnique({
        where: { email },
        select: { id: true, senha: true }
    });
    if (!usuarioComSenha)
        throw new Error("Usuário não encontrado");
    const senhaValida = await bcryptjs_1.default.compare(senha, usuarioComSenha.senha);
    if (!senhaValida)
        throw new Error("Senha inválida");
    // 2) buscar dados públicos do usuário (sem senha)
    const usuarioPublico = await prismaClient_1.default.usuario.findUnique({
        where: { id: usuarioComSenha.id },
        select: { id: true, email: true, nome: true, role: true, clienteId: true }
    });
    if (!usuarioPublico)
        throw new Error("Usuário não encontrado");
    // 3) gerar tokens
    const payload = { id: usuarioPublico.id, role: usuarioPublico.role };
    const tokenAcesso = (0, jwt_1.gerarTokenAcesso)(payload);
    const tokenRefresh = (0, jwt_1.gerarRefreshToken)({ id: usuarioPublico.id });
    // 4) salvar hash do refresh token no banco
    const tokenRefreshHash = hashToken(tokenRefresh);
    const expiracao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
    await prismaClient_1.default.refreshToken.create({
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
async function renovarToken(tokenRefresh) {
    const registro = await prismaClient_1.default.refreshToken.findUnique({ where: { token: tokenRefresh } });
    if (!registro)
        throw new Error("Refresh token inválido");
    if (registro.expiracao < new Date()) {
        await prismaClient_1.default.refreshToken.delete({ where: { id: registro.id } });
        throw new Error("Refresh token expirado");
    }
    const usuario = await prismaClient_1.default.usuario.findUnique({ where: { id: registro.usuarioId } });
    if (!usuario)
        throw new Error("Usuário não encontrado");
    const payload = { id: usuario.id, email: usuario.email, role: usuario.role };
    const tokenAcesso = (0, jwt_1.gerarTokenAcesso)(payload);
    return { tokenAcesso };
}
/**
 * iniciarRecuperacaoSenha
 * Gera um código, salva e envia por e-mail para o usuário.
 */
async function iniciarRecuperacaoSenha(email) {
    const usuario = await prismaClient_1.default.usuario.findUnique({ where: { email } });
    if (!usuario)
        throw new Error("Usuário não encontrado");
    const codigo = (0, geradorCodigo_1.gerarCodigoNumerico)(6);
    const expiracao = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos
    // Upsert do código de recuperação
    await prismaClient_1.default.codigoRecuperacao.upsert({
        where: { usuarioId: usuario.id },
        update: { codigo, expiracao },
        create: { codigo, expiracao, usuarioId: usuario.id }
    });
    await (0, EmailService_1.enviarEmailCodigo)(email, codigo);
    return { mensagem: "Código enviado por e-mail" };
}
/**
 * confirmarRecuperacaoSenha
 * Verifica código e atualiza a senha do usuário.
 */
async function confirmarRecuperacaoSenha(email, codigo, novaSenha) {
    const usuario = await prismaClient_1.default.usuario.findUnique({ where: { email }, include: { codigoRecuperacao: true } });
    if (!usuario || !usuario.codigoRecuperacao)
        throw new Error("Código inválido");
    if (usuario.codigoRecuperacao.codigo !== codigo)
        throw new Error("Código inválido");
    if (usuario.codigoRecuperacao.expiracao < new Date())
        throw new Error("Código expirado");
    const senhaHash = await bcryptjs_1.default.hash(novaSenha, 10);
    await prismaClient_1.default.usuario.update({ where: { id: usuario.id }, data: { senha: senhaHash } });
    await prismaClient_1.default.codigoRecuperacao.delete({ where: { id: usuario.codigoRecuperacao.id } });
    return { mensagem: "Senha atualizada com sucesso" };
}
