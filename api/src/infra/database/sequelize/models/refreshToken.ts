import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../index";
import { UserRepository } from "./user";
import { hash } from "bcrypt";

export type RefreshTokenCreationAttributes = {
  userId: number;
  token: string;
  expiresAt: Date;
};

export type RefreshTokenAttributes = {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

class RefreshToken extends Model<
  RefreshTokenAttributes,
  RefreshTokenCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare token: string;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserRepository,
        key: "id",
      },
    },
    token: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    revokedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "refresh-tokens",
    // hooks: {
    //   beforeSave: async (refreshToken) => {
    //     refreshToken.token = await hash(refreshToken.token, 10);
    //   },
    // },
  },
);

export { RefreshToken as RefreshTokenRepository };
