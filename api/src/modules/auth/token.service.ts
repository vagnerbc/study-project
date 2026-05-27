import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET ?? "";
// const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION ?? "1h";
// const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION ?? "7d";

export const tokenService = {
  generateAccessToken: (payload: AccessTokenPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });
  },
  verifyAccessToken: (token: string) => {
    return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  },
  generateRefreshToken: (payload: RefreshTokenPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });
  },
  verifyRefreshToken: (token: string) => {
    return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
  },
  generateRefreshTokenExpiresDate: () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return date;
  },
};
