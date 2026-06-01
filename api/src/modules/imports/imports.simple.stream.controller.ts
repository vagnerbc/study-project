import csvParser from "csv-parser";
import { Request, Response } from "express";
import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { ProductRepository } from "../../infra/database/sequelize/models/product";

export const simpleImportStreamController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let errors: any = [];

    await new Promise<void>((resolve, reject) => {
      let rowIndex = 0;
      const readStream = createReadStream(req.file!.path);
      readStream
        .pipe(csvParser({}))
        .on("data", async (row) => {
          rowIndex++;
          console.log(row);

          const validation = validate(row, rowIndex);

          if (!validation.valid) {
            errors.push(Object.fromEntries(validation.errors ?? []));
            return;
          }

          const product = row as ProductCSV;

          await ProductRepository.create(product);
        })
        .on("end", () => {
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    await unlink(req.file.path);

    if (errors.length > 0) {
      res.status(400).json({
        message: "File has invalid rows",
        errors: errors,
      });
    }

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

type ProductCSV = {
  name: string;
  sku: string;
  price: number;
  stock: number;
};

const validate = (
  row: any,
  rowIndex: number,
): { valid: boolean; errors?: Map<number, string[]> } => {
  try {
    const { name, sku, price, stock } = row;

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
