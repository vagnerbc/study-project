import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "../../infra/database/sequelize/models/user";

const router = Router();
const userService = new UserService(UserRepository);
const userController = new UserController(userService);

router.get("/", userController.findAll);

router.post("/", userController.create);

export { router as userRouter };
