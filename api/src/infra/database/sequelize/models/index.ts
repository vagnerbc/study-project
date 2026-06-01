import { OrderRepository } from "./order";
import { OrderItemRepository } from "./orderItem";
import { ProductRepository } from "./product";
import { RefreshTokenRepository } from "./refreshToken";
import { UserRepository } from "./user";

UserRepository.hasMany(RefreshTokenRepository, {
  as: "refreshTokens",
  foreignKey: "userId",
});

RefreshTokenRepository.belongsTo(UserRepository, {
  as: "user",
});

UserRepository.hasMany(OrderRepository, {
  as: "orders",
  foreignKey: "userId",
});

OrderRepository.belongsTo(UserRepository, {
  as: "user",
});

OrderRepository.hasMany(OrderItemRepository, {
  as: "items",
  foreignKey: "orderId",
});

OrderItemRepository.belongsTo(OrderRepository, {
  as: "order",
});

ProductRepository.hasMany(OrderItemRepository, {
  as: "orderItems",
  foreignKey: "productId",
});

OrderItemRepository.belongsTo(ProductRepository, {
  as: "product",
});

export default {
  RefreshTokenRepository,
  UserRepository,
  OrderRepository,
  OrderItemRepository,
  ProductRepository,
};
