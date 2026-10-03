"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * prisma/seed.ts
 * Script para popular dados iniciais (idempotente).
 */
const prismaClient_1 = __importDefault(require("../src/prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const emailAdmin = "admin@example.com";
    const senhaAdminPlain = "admin123";
    const senhaAdminHash = await bcryptjs_1.default.hash(senhaAdminPlain, 10);
    // Cria usuário admin se não existir
    const usuarioExistente = await prismaClient_1.default.usuario.findUnique({ where: { email: emailAdmin } });
    if (!usuarioExistente) {
        await prismaClient_1.default.usuario.create({
            data: {
                email: emailAdmin,
                senha: senhaAdminHash,
                nome: "Administrador",
                role: "ADMIN"
            }
        });
        console.log("Usuário admin criado:", emailAdmin);
    }
    else {
        console.log("Usuário admin já existe:", emailAdmin);
    }
    // Categoria: usar findFirst/create (nome não é unique no schema)
    const nomeCategoria = "Geral";
    let categoria = await prismaClient_1.default.categoriaProduto.findFirst({ where: { nome: nomeCategoria } });
    if (!categoria) {
        categoria = await prismaClient_1.default.categoriaProduto.create({ data: { nome: nomeCategoria } });
        console.log("Categoria criada:", nomeCategoria);
    }
    else {
        console.log("Categoria já existe:", nomeCategoria);
    }
    // Produto: procurar por nome e criar se não existir
    const nomeProduto = "Produto Exemplo";
    const produtoExistente = await prismaClient_1.default.produto.findFirst({ where: { nome: nomeProduto } });
    if (!produtoExistente) {
        await prismaClient_1.default.produto.create({
            data: {
                nome: nomeProduto,
                descricao: "Produto de exemplo",
                preco: 10.0,
                estoque: 100,
                categoriaId: categoria.id
            }
        });
        console.log("Produto criado:", nomeProduto);
    }
    else {
        console.log("Produto já existe:", nomeProduto);
    }
}
main()
    .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prismaClient_1.default.$disconnect();
});
