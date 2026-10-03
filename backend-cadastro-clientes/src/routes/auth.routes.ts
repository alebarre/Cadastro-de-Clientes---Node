/**
 * auth.routes.ts
 * Rotas relacionadas à autenticação.
 */
import { Router } from "express";
import * as AuthController from "../controllers/AuthController";

const router = Router();

router.post("/register", AuthController.registrar);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/forgot", AuthController.esqueciSenha);
router.post("/forgot/confirm", AuthController.confirmarRecuperacao);

export default router;
