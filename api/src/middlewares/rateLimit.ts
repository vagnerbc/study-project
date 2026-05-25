import { Request, Response, NextFunction } from "express";
import { RedisClient } from "../infra/cache/redis";

export const rateLimit = (limit: number, expiration: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const key = `rate-limit:${ip}`;

    const requests = await RedisClient.incr(key);

    if (requests === 1) {
      await RedisClient.expire(key, expiration);
    }

    if (requests > limit) {
      return res.status(429).json({
        message: "Too many requests",
      });
    }

    next();
  };
};
