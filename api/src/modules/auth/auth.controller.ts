import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AppError } from "../../errors/appError";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const session = await this.authService.register(email, password);

    setRefreshTokenCookies(res, session.refreshToken);

    res.status(200).json({
      accessToken: session.accessToken,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const session = await this.authService.login(email, password);

    setRefreshTokenCookies(res, session.refreshToken);

    res.status(200).json({
      accessToken: session.accessToken,
    });
  };

  refreshSession = async (req: Request, res: Response) => {
    try {
      // get the refresh token from the cookies
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AppError("Refresh token is missing", 401);
      }

      const session = await this.authService.refreshSession(refreshToken);

      setRefreshTokenCookies(res, session.refreshToken);

      res.status(200).json({
        accessToken: session.accessToken,
      });
    } catch (error) {
      clearRefreshTokenCookies(res);

      throw error;
    }
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    await this.authService.logout(refreshToken);

    clearRefreshTokenCookies(res);

    res.status(204).send();
  };

  me = async (req: Request, res: Response) => {
    const userId = Number(req?.user?.id);

    const user = await this.authService.me(userId);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  };
}

const setRefreshTokenCookies = (res: Response, refreshToken: string) => {
  /**
   * httpOnly: To secure againt XSS - Frontend javascript cannot read cookie
   *
   * secury: Used in production - only works on https
   *
   * sameSite: stritc - Just same domain can send cookies
   */

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshTokenCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/auth/refresh",
  });
};
