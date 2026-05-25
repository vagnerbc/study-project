import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "../../infra/database/sequelize/models/user";
import { validationHandler } from "../../middlewares/validationHandler";
import { createUserSchema } from "./user.schemas";
import { UserCache } from "./user.cache";
import { RedisClient } from "../../infra/cache/redis";
import { rateLimit } from "../../middlewares/rateLimit";

const router = Router();
const userCache = new UserCache(RedisClient);
const userService = new UserService(UserRepository, userCache);
const userController = new UserController(userService);

router.get("/", userController.findAll);

router.post(
  "/",
  rateLimit(10),
  validationHandler({
    body: createUserSchema,
  }),
  userController.create,
);

export { router as userRouter };
