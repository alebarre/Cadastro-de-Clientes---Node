"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarCategoriaProduto = cadastrarCategoriaProduto;
exports.cadastrarProduto = cadastrarProduto;
const prismaClient_1 = __importDefault(require("../prismaClient"));
/**
 * cadastrarCategoriaProduto
 * Cria uma nova categoria de produto.
 */
async function cadastrarCategoriaProduto(req, res) {
    try {
        const { nome } = req.body;
        const categoria = await prismaClient_1.default.categoriaProduto.create({ data: { nome } });
        return res.status(201).json(categoria);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
/**
 * cadastrarProduto
 * Cria um novo produto associado a uma categoria.
 */
async function cadastrarProduto(req, res) {
    try {
        const { nome, descricao, preco, estoque, categoriaId } = req.body;
        const produto = await prismaClient_1.default.produto.create({
            data: { nome, descricao, preco: Number(preco), estoque: Number(estoque), categoriaId }
        });
        return res.status(201).json(produto);
    }
    catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}
