import { AppError } from "../../errors/appError";
import {
  UserCreationAttributes,
  UserRepository,
} from "../../infra/database/sequelize/models/user";

export class UserService {
  constructor(private userRepository: typeof UserRepository) {}

  async findAll() {
    const users = await this.userRepository.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    return users;
  }

  async create(data: UserCreationAttributes) {
    const userAlreadyExists = await this.userRepository.findOne({
      where: {
        name: data.name,
      },
    });

    if (userAlreadyExists) {
      throw new AppError("User already exists", 409);
    }

    return await this.userRepository.create(data);
  }
}
