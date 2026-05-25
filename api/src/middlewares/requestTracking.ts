import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";
import pino from "pino";

export const logger = pino();

export const requestTracking = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.requestId = String(req.headers["x-request-id"] || randomUUID());

  const start = Date.now();

  logger.info(
    {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
    },
    "Request started",
  );

  res.on("finish", () => {
    logger.info(
      {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      },
      "Request finished",
    );
  });

  next();
};
