/**
 * ProdutoController.ts
 * Controlador para produtos e categorias.
 */
import { Request, Response } from "express";
import prisma from "../prismaClient";

/**
 * cadastrarCategoriaProduto
 * Cria uma nova categoria de produto.
 */
export async function cadastrarCategoriaProduto(req: Request, res: Response) {
  try {
    const { nome } = req.body;
    const categoria = await prisma.categoriaProduto.create({ data: { nome } });
    return res.status(201).json(categoria);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}

/**
 * cadastrarProduto
 * Cria um novo produto associado a uma categoria.
 */
export async function cadastrarProduto(req: Request, res: Response) {
  try {
    const { nome, descricao, preco, estoque, categoriaId } = req.body;
    const produto = await prisma.produto.create({
      data: { nome, descricao, preco: Number(preco), estoque: Number(estoque), categoriaId }
    });
    return res.status(201).json(produto);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}
