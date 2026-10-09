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
  if (!req.body.cpf) {
    return res.status(400).json({ erro: "CPF é obrigatório" });
  }
  const cpf = req.body.cpf;
  const existingCpf = await prisma.cliente.findUnique({ where: { cpf } });
  if (existingCpf) {
    return res.status(400).json({ erro: "CPF já cadastrado" });
  }
  try {
    const { nome, cpf, telefones } = req.body;
    const enderecos = req.body.enderecos;
    if (!enderecos || !Array.isArray(enderecos) || enderecos.length === 0) {
      return res.status(400).json({ erro: "Pelo ou menos 1 endereço é obrigatório" });
    }
    const cliente = await prisma.cliente.create({
      data: { nome, cpf, telefones }
    });
    try {
      for (const endereco of enderecos) {
        await prisma.endereco.create({
          data: { ...endereco, clienteId: cliente.id }
        });
      }
    } catch (err: any) {
      return res.status(400).json({ erro: err.message });
    }
    const clienteComEnderecos = await prisma.cliente.findUnique({
      where: { id: cliente.id },
      include: { enderecos: true }
    });
    return res.status(201).json(clienteComEnderecos);
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

export async function obterCliente(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: String(id) },
      include: { enderecos: true, pedidos: true }
    });
    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }
    const enderecoCliente = await prisma.endereco.findMany({
      where: { clienteId: cliente.id }
    });
    return res.json({ ...cliente, enderecos: enderecoCliente });
  } catch (err: any) {
    return res.status(500).json({ erro: err.message });
  }
}
