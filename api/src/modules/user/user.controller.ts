import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  findAll = async (req: Request, res: Response) => {
    const users = await this.userService.findAll();

    res.json(users);
  };

  create = async (req: Request, res: Response) => {
    req.log.info({
      requestId: req.requestId,
      requestName: "Create user",
    });
    const { name, email, password } = req.body;

    const newUser = await this.userService.create({
      name,
      email,
      password,
    });

    res.json(newUser);
  };
}
