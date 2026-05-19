import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "../../infra/database/sequelize/models/user";
import { validationHandler } from "../../middlewares/validationHandler";
import { createUserSchema } from "./user.schemas";

const router = Router();
const userService = new UserService(UserRepository);
const userController = new UserController(userService);

router.get("/", userController.findAll);

router.post(
  "/",
  validationHandler({
    body: createUserSchema,
  }),
  userController.create,
);

export { router as userRouter };
