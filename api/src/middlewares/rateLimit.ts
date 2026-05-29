import { Request, Response, NextFunction } from "express";
import { RedisClient } from "../infra/cache/redis";

export const rateLimit = (limit: number, expiration: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      const route = `${req.baseUrl}${req.path}`;
      const key = `rate-limit:${req.method}:${route}:${ip}`;

      const requests = await RedisClient.incr(key);
      let ttl = await RedisClient.ttl(key);

      if (ttl < 0) {
        await RedisClient.expire(key, expiration);
        ttl = expiration;
      }

      const remaining = Math.max(limit - requests, 0);
      const reset = Math.ceil(Date.now() / 1000) + ttl;

      res.setHeader("RateLimit-Limit", limit);
      res.setHeader("RateLimit-Remaining", remaining);
      res.setHeader("RateLimit-Reset", reset);

      if (requests > limit) {
        res.setHeader("Retry-After", ttl);

        return res.status(429).json({
          message: "Too many requests",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
