import csvParser from "csv-parser";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { Transaction } from "sequelize";
import { sequelize } from "../../infra/database/sequelize";
import { ProductRepository } from "../../infra/database/sequelize/models/product";

const EXPECTED_HEADERS = ["name", "sku", "price", "stock"] as const;
const STREAM_BATCH_SIZE = 500;

export type ProductImportResult = {
  imported: number;
};

type ProductInput = {
  name: string;
  sku: string;
  price: number;
  stock: number;
};

type ProductRow = {
  name?: string;
  sku?: string;
  price?: string;
  stock?: string;
};

type ProductRowError = {
  row: number;
  errors: string[];
};

export class InvalidImportFileError extends Error {
  constructor(readonly errors: ProductRowError[]) {
    super("File has invalid rows");
    this.name = "InvalidImportFileError";
  }
}

export const importProductsFromFullFile = async (
  filePath: string,
): Promise<ProductImportResult> => {
  const fileContent = await readFile(filePath, "utf-8");
  const rows = await readCsvRows(Readable.from([fileContent]));
  const { products, errors } = validateAndParseRows(rows);

  if (errors.length > 0) {
    throw new InvalidImportFileError(errors);
  }

  await saveProductsInBulk(products);

  return {
    imported: products.length,
  };
};

export const importProductsFromStream = async (
  filePath: string,
): Promise<ProductImportResult> => {
  const transaction = await sequelize.transaction();
  const batch: ProductInput[] = [];
  const errors: ProductRowError[] = [];
  let imported = 0;
  let rowIndex = 1;
  let transactionClosed = false;

  try {
    const stream = createReadStream(filePath).pipe(createCsvParser());

    for await (const row of stream) {
      rowIndex++;

      const parsedRow = normalizeRow(row as ProductRow);
      const rowErrors = validateProductRow(parsedRow);

      if (rowErrors.length > 0) {
        errors.push({
          row: rowIndex,
          errors: rowErrors,
        });
        continue;
      }

      batch.push(parseProductRow(parsedRow));

      if (batch.length >= STREAM_BATCH_SIZE) {
        await saveProductsBatch(batch, transaction);
        imported += batch.length;
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await saveProductsBatch(batch, transaction);
      imported += batch.length;
    }

    if (errors.length > 0) {
      await transaction.rollback();
      transactionClosed = true;
      throw new InvalidImportFileError(errors);
    }

    await transaction.commit();
    transactionClosed = true;

    return {
      imported,
    };
  } catch (error) {
    if (!transactionClosed) {
      await transaction.rollback();
    }

    throw error;
  }
};

const readCsvRows = async (readStream: Readable): Promise<ProductRow[]> => {
  const rows: ProductRow[] = [];
  const stream = readStream.pipe(createCsvParser());

  for await (const row of stream) {
    rows.push(normalizeRow(row as ProductRow));
  }

  return rows;
};

const createCsvParser = () =>
  csvParser({
    mapHeaders: ({ header }: { header: string }) => header.trim(),
    mapValues: ({ value }: { value: string }) => value.trim(),
  });

const validateAndParseRows = (
  rows: ProductRow[],
): { products: ProductInput[]; errors: ProductRowError[] } => {
  const products: ProductInput[] = [];
  const errors: ProductRowError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors = validateProductRow(row);

    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        errors: rowErrors,
      });
      return;
    }

    products.push(parseProductRow(row));
  });

  return { products, errors };
};

const normalizeRow = (row: ProductRow): ProductRow =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.trim(),
      typeof value === "string" ? value.trim() : value,
    ]),
  );

const validateProductRow = (row: ProductRow): string[] => {
  const errors: string[] = [];

  for (const header of EXPECTED_HEADERS) {
    if (!(header in row)) {
      errors.push(`Missing column: ${header}`);
    }
  }

  if (!row.name) {
    errors.push("Name is required");
  }

  if (!row.sku) {
    errors.push("SKU is required");
  }

  const price = Number(row.price);
  if (!row.price || !Number.isFinite(price)) {
    errors.push("Price must be a valid number");
  } else if (price < 0) {
    errors.push("Price must be greater than or equal to zero");
  }

  const stock = Number(row.stock);
  if (!row.stock || !Number.isInteger(stock)) {
    errors.push("Stock must be a valid integer");
  } else if (stock < 0) {
    errors.push("Stock must be greater than or equal to zero");
  }

  return errors;
};

const parseProductRow = (row: ProductRow): ProductInput => ({
  name: row.name ?? "",
  sku: row.sku ?? "",
  price: Number(row.price),
  stock: Number(row.stock),
});

const saveProductsInBulk = async (products: ProductInput[]) => {
  const transaction = await sequelize.transaction();

  try {
    await saveProductsBatch(products, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const saveProductsBatch = async (
  products: ProductInput[],
  transaction: Transaction,
) => {
  if (products.length === 0) {
    return;
  }

  await ProductRepository.bulkCreate(products, { transaction });
};
