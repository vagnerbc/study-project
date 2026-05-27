import { RefreshTokenRepository } from "./refreshToken";
import { UserRepository } from "./user";

UserRepository.hasMany(RefreshTokenRepository, {
  as: "refreshTokens",
  foreignKey: "userId",
});

RefreshTokenRepository.belongsTo(UserRepository, {
  as: "user",
});

export default {
  RefreshTokenRepository,
  UserRepository,
};
