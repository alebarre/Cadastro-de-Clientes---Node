/**
 * prisma/seed.ts
 * Script para popular dados iniciais (idempotente).
 */
import prisma from "../src/prismaClient";
import bcrypt from "bcryptjs";

async function main() {
  const emailAdmin = "admin@example.com";
  const senhaAdminPlain = "admin123";
  const senhaAdminHash = await bcrypt.hash(senhaAdminPlain, 10);

  // Cria usuário admin se não existir
  const usuarioExistente = await prisma.usuario.findUnique({ where: { email: emailAdmin } });
  if (!usuarioExistente) {
    await prisma.usuario.create({
      data: {
        email: emailAdmin,
        senha: senhaAdminHash,
        nome: "Administrador",
        role: "ADMIN"
      }
    });
    console.log("Usuário admin criado:", emailAdmin);
  } else {
    console.log("Usuário admin já existe:", emailAdmin);
  }

  // Categoria: usar findFirst/create (nome não é unique no schema)
  const nomeCategoria = "Geral";
  let categoria = await prisma.categoriaProduto.findFirst({ where: { nome: nomeCategoria } });
  if (!categoria) {
    categoria = await prisma.categoriaProduto.create({ data: { nome: nomeCategoria } });
    console.log("Categoria criada:", nomeCategoria);
  } else {
    console.log("Categoria já existe:", nomeCategoria);
  }

  // Produto: procurar por nome e criar se não existir
  const nomeProduto = "Produto Exemplo";
  const produtoExistente = await prisma.produto.findFirst({ where: { nome: nomeProduto } });
  if (!produtoExistente) {
    await prisma.produto.create({
      data: {
        nome: nomeProduto,
        descricao: "Produto de exemplo",
        preco: 10.0,
        estoque: 100,
        categoriaId: categoria.id
      }
    });
    console.log("Produto criado:", nomeProduto);
  } else {
    console.log("Produto já existe:", nomeProduto);
  }
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
