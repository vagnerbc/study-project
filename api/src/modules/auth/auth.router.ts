import { Router } from "express";
import { RefreshTokenRepository } from "../../infra/database/sequelize/models/refreshToken";
import { UserRepository } from "../../infra/database/sequelize/models/user";
import { rateLimit } from "../../middlewares/rateLimit";
import { validationHandler } from "../../middlewares/validationHandler";
import { createUserSchema } from "../user/user.schemas";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { authHandler } from "../../middlewares/authHandler";

const router = Router();
const authService = new AuthService(UserRepository, RefreshTokenRepository);
const authController = new AuthController(authService);

router.get("/me", authHandler, authController.me);

router.post(
  "/register",
  rateLimit(10),
  validationHandler({
    body: createUserSchema,
  }),
  authController.register,
);

router.post(
  "/login",
  rateLimit(10),
  validationHandler({
    body: createUserSchema,
  }),
  authController.login,
);

router.post("/logout", authController.logout);

router.post("/refresh", rateLimit(10), authController.refreshSession);

export { router as authRouter };
