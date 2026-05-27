import { hash, compare } from "bcrypt";
import { randomUUID } from "crypto";
import { AppError } from "../../errors/appError";
import { RefreshTokenRepository } from "../../infra/database/sequelize/models/refreshToken";
import { UserRepository } from "../../infra/database/sequelize/models/user";
import { tokenService } from "./token.service";
import { Op } from "sequelize";

export class AuthService {
  constructor(
    private userRepository: typeof UserRepository,
    private refreshTokenRepository: typeof RefreshTokenRepository,
  ) {}

  async me(userId: number) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async register(email: string, password: string) {
    const userAlreadyExists = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new AppError("User already registered");
    }

    const user = await this.userRepository.create({
      name: email.split("@")[0] || "",
      email,
      password,
    });

    return this.createSession(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("Invalid credentials");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials");
    }

    return this.createSession(user.id, user.email);
  }

  async createSession(userId: number, email: string) {
    const accessToken = tokenService.generateAccessToken({
      sub: userId.toString(),
      email,
    });

    const refreshToken = tokenService.generateRefreshToken({
      sub: userId.toString(),
      email,
    });

    const expiresAt = tokenService.generateRefreshTokenExpiresDate();

    const hashToken = await hash(refreshToken, 6);

    await this.refreshTokenRepository.create({
      userId: userId,
      expiresAt,
      token: hashToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshSession(refreshToken: string) {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    const userId = Number(payload.sub);

    const user = this.userRepository.findByPk(userId);

    if (!user) {
      throw new AppError("Invalid refresh token", 401);
    }

    const storedToken = await this.findValidToken(userId, refreshToken);

    if (!storedToken) {
      throw new AppError("Invalid or revoked refresh token", 401);
    }

    // refresh token rotation
    await this.revokeTokenById(storedToken.id);

    return this.createSession(userId, payload.email);
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = tokenService.verifyRefreshToken(refreshToken);

      const storedToken = await this.findValidToken(
        Number(payload.sub),
        refreshToken,
      );

      console.log({ storedToken });

      if (!storedToken) return;

      await this.revokeTokenById(storedToken.id);
    } catch (error) {}
  }

  private findValidToken = async (userId: number, refreshToken: string) => {
    const now = new Date();
    const tokens = await this.refreshTokenRepository.findAll({
      where: {
        userId: userId,
        expiresAt: {
          [Op.gt]: now,
        },
        revokedAt: {
          [Op.eq]: null,
        },
      },
    });

    console.log({ tokens });

    for (const t of tokens) {
      if (await compare(refreshToken, t.token)) {
        return t;
      }
    }

    return null;
  };

  private revokeTokenById = async (tokenId: number) => {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        id: tokenId,
      },
    });

    console.log({ refreshToken });
    if (!refreshToken) return;

    refreshToken.revokedAt = new Date();
    await refreshToken.save();
  };
}
