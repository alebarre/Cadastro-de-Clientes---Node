/**
 * cliente.routes.ts
 * Rotas para gerenciamento de clientes.
 */
import { Router } from "express";
import * as ClienteController from "../controllers/ClienteController";
import { autenticarJWT } from "../middlewares/autenticarJWT";
import { verificarRole } from "../middlewares/verificarRole";

const router = Router();

router.post("/", autenticarJWT, verificarRole(["ADMIN", "VENDEDOR"]), ClienteController.cadastrarCliente);
router.get("/", autenticarJWT, verificarRole(["ADMIN", "VENDEDOR"]), ClienteController.listarClientes);
router.get("/cliente/:id", autenticarJWT, verificarRole(["ADMIN", "VENDEDOR"]), ClienteController.obterCliente);

export default router;
