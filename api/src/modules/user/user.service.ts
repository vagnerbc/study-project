import { AppError } from "../../errors/appError";
import {
  UserCreationAttributes,
  UserRepository,
} from "../../infra/database/sequelize/models/user";
import { UserCache } from "./user.cache";

export class UserService {
  constructor(
    private userRepository: typeof UserRepository,
    private userCache: UserCache,
  ) {}

  async findAll() {
    let usersCache = null;

    usersCache = await this.userCache.getAll();

    if (usersCache) {
      return usersCache;
    }

    const users = await this.userRepository.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    await this.userCache.addAll(users);

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

    const user = await this.userRepository.create(data);

    await this.userCache.add(user);

    return user;
  }
}
