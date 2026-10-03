/**
 * produto.routes.ts
 * Rotas para produtos e categorias.
 */
import { Router } from "express";
import * as ProdutoController from "../controllers/ProdutoController";
import { autenticarJWT } from "../middlewares/autenticarJWT";
import { verificarRole } from "../middlewares/verificarRole";

const router = Router();

router.post("/categoria", autenticarJWT, verificarRole(["ADMIN"]), ProdutoController.cadastrarCategoriaProduto);
router.post("/", autenticarJWT, verificarRole(["ADMIN"]), ProdutoController.cadastrarProduto);

export default router;
