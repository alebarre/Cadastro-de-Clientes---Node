"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarCliente = cadastrarCliente;
exports.listarClientes = listarClientes;
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../prismaClient"));
/**
 * cadastrarCliente
 * Cria um novo cliente no sistema.
 */
async function cadastrarCliente(req, res) {
    try {
        const { nome, cpf, telefones, enderecos } = req.body;
        const cliente = await prismaClient_1.default.cliente.create({
            data: { nome, cpf, telefones, enderecos }
        });
        return res.status(201).json(cliente);
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return res.status(409).json({ erro: "Já existe um cliente cadastrado com este CPF" });
        }
        return res.status(400).json({ erro: err.message });
    }
}
/**
 * listarClientes
 * Retorna lista de clientes (paginada).
 */
async function listarClientes(req, res) {
    try {
        const clientes = await prismaClient_1.default.cliente.findMany({ include: { enderecos: true, pedidos: true } });
        return res.json(clientes);
    }
    catch (err) {
        return res.status(500).json({ erro: err.message });
    }
}
