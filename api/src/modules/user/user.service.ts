import {
  UserCreationAttributes,
  UserRepository,
} from "../../infra/database/sequelize/models/user";

export class UserService {
  constructor(private userRepository: typeof UserRepository) {}

  async findAll() {
    return await this.userRepository.findAll();
  }

  async create(data: UserCreationAttributes) {
    return await this.userRepository.create(data);
  }
}
