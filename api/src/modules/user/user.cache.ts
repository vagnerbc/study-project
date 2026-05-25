import { RedisClient } from "../../infra/cache/redis";
import { logger } from "../../middlewares/requestTracking";
import { UserAttributes } from "./user.types";

enum keys {
  ALL = "users:all",
}

export class UserCache {
  constructor(private cache: typeof RedisClient) {}

  public async getAll() {
    try {
      const data = await this.cache.get(keys.ALL);

      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log("No users:all data cached", error);
      logger.warn({
        type: "cache",
        method: "Users getAll",
      });
    }
  }

  public async addAll(users: UserAttributes[]) {
    try {
      await this.cache.del(keys.ALL);

      await this.cache.set(keys.ALL, JSON.stringify(users), {
        expiration: {
          type: "EX",
          value: 60 + 5,
        },
      });
    } catch (error) {
      console.log("Error add users:all data to cache");
      logger.warn({
        type: "cache",
        method: "Users addAll",
      });
    }
  }

  public async add(user: UserAttributes) {
    try {
      const key = `user:${user?.id}`;

      await this.cache.del(keys.ALL);
      await this.cache.del(key);

      await this.cache.set(key, JSON.stringify(user), {
        expiration: {
          type: "EX",
          value: 60 + 5,
        },
      });
    } catch (error) {
      console.log("Error add user data to cache");
      logger.warn({
        type: "cache",
        method: "Users add",
      });
    }
  }
}
