import { Request, Response, NextFunction } from "express";
import { UniqueConstraintError } from "sequelize";
import { ZodError } from "zod";
import { AppError } from "../errors/appError";
import { logger } from "./requestTracking";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ZodError) {
    req.log.error(
      {
        requestId: req.id,
      },
      "Validation error",
    );
    return res.status(400).json({
      message: "Validation error",
      errors: error.issues.map((err) => ({
        path: err.path.join(","),
        message: err.message,
      })),
    });
  }

  if (error instanceof AppError) {
    req.log.error(
      {
        requestId: req.id,
      },
      error.message,
    );
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof UniqueConstraintError) {
    req.log.error(
      {
        requestId: req.id,
      },
      error.message,
    );
    return res.status(400).json({
      message: "Data already exists",
    });
  }

  console.log(error);
  req.log.error(
    {
      requestId: req.id,
    },
    "Internal server error",
  );

  return res.status(500).json({
    message: "Internal server error",
  });
};
