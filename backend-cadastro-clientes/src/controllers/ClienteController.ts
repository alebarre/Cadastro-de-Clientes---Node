/**
 * ClienteController.ts
 * Controlador para operações CRUD de clientes.
 */
import { Request, Response } from "express";
import prisma from "../prismaClient";

/**
 * cadastrarCliente
 * Cria um novo cliente no sistema.
 */
export async function cadastrarCliente(req: Request, res: Response) {
  try {
    const { nome, cpf, telefones } = req.body;
    const cliente = await prisma.cliente.create({
      data: { nome, cpf, telefones }
    });
    return res.status(201).json(cliente);
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}

/**
 * listarClientes
 * Retorna lista de clientes (paginada).
 */
export async function listarClientes(req: Request, res: Response) {
  try {
    const clientes = await prisma.cliente.findMany({ include: { enderecos: true, pedidos: true } });
    return res.json(clientes);
  } catch (err: any) {
    return res.status(500).json({ erro: err.message });
  }
}
