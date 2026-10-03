/**
 * prismaClient.ts
 * Inicializa e exporta o cliente Prisma para uso em toda a aplicação.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
