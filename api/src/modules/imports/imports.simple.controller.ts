import { Request, Response } from "express";
import { readFile, unlink } from "node:fs/promises";
import { sequelize } from "../../infra/database/sequelize";
import { ProductRepository } from "../../infra/database/sequelize/models/product";

export const simpleImportController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileContent = await readFile(req.file.path, "utf-8");

    const lines = fileContent
      .split("\n")
      .filter((line, index) => index > 0 && line.trim() !== "");

    let products: Product[] = [];

    for (const line of lines) {
      const { valid, errors } = validateRow(line, lines.indexOf(line));

      if (!valid) {
        return res.status(400).json({
          message: "Invalid file format",
          error: Object.fromEntries(errors ?? []),
        });
      }

      const product = parseRow(line);
      products.push(product);
    }

    // await saveProducts(products);
    await saveProductsInBulk(products);

    await unlink(req.file.path);

    res.status(200).json({
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      message: "An error occurred while processing the file",
    });
  } finally {
    if (req.file) {
      await unlink(req.file.path).catch((err) => {
        console.error("Error deleting file:", err);
      });
    }
  }
};

type Product = {
  name: string;
  sku: string;
  price: number;
  stock: number;
};

const validateRow = (
  row: string,
  rowIndex: number,
): { valid: boolean; errors?: Map<number, string[]> } => {
  try {
    const [name, sku, price, stock] = row.split(",");

    const errors = new Map<number, string[]>();

    if (!name) {
      errors.set(rowIndex, ["Name is required"]);
    }

    if (!sku) {
      if (errors.has(rowIndex)) {
        errors.get(rowIndex)?.push("SKU is required");
      } else {
        errors.set(rowIndex, ["SKU is required"]);
      }
    }

    if (!price || isNaN(parseFloat(price))) {
      if (errors.has(rowIndex)) {
        errors.get(rowIndex)?.push("Price must be a valid number");
      } else {
        errors.set(rowIndex, ["Price must be a valid number"]);
      }
    }

    if (!stock || isNaN(parseInt(stock))) {
      if (errors.has(rowIndex)) {
        errors.get(rowIndex)?.push("Stock must be a valid integer");
      } else {
        errors.set(rowIndex, ["Stock must be a valid integer"]);
      }
    }

    return {
      valid: errors.size === 0,
      errors: errors,
    };
  } catch (error) {
    console.error("Error validating row:", error);
    return {
      valid: false,
      errors: new Map([[rowIndex, ["Unexpected error validating row"]]]),
    };
  }
};

const parseRow = (row: string) => {
  const [name, sku, price, stock] = row.split(",");

  return {
    name,
    sku,
    price: price ? parseFloat(price) : 0,
    stock: stock ? parseInt(stock) : 0,
  } as Product;
};

const saveProducts = async (products: Product[]) => {
  const transaction = await sequelize?.transaction();

  try {
    for (const product of products) {
      await ProductRepository.create(product, { transaction });
    }

    await transaction?.commit();
  } catch (error) {
    await transaction?.rollback();
    throw error;
  }
};

const saveProductsInBulk = async (products: Product[]) => {
  try {
    await ProductRepository.bulkCreate(products);
  } catch (error) {
    console.error("Error saving products in bulk:", error);
    throw error;
  }
};
