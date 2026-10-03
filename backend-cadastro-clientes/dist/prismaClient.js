"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * prismaClient.ts
 * Inicializa e exporta o cliente Prisma para uso em toda a aplicação.
 */
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = prisma;
