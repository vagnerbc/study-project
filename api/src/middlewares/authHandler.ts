import { NextFunction, Request, Response } from "express";
import { tokenService } from "../modules/auth/token.service";

export const authHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  const [_, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({
      message: "Token invalid",
    });
  }

  try {
    const payload = tokenService.verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};
