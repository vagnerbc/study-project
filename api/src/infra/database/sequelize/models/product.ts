import { DataTypes, Model } from "sequelize";
import { sequelize } from "..";

class Product extends Model {
  declare id: number;
  declare name: string;
  declare sku: string;
  declare price: number;
  declare stock: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "products",
  },
);

export { Product as ProductRepository };
