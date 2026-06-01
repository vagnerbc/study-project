import { DataTypes, Model } from "sequelize";
import { sequelize } from "..";

class Order extends Model {
  declare id: number;
  declare userId: number;
  declare total: number;
  declare status: string;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "orders",
  },
);

export { Order as OrderRepository };
