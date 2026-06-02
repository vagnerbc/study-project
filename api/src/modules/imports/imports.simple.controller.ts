import { Request, Response } from "express";
import { unlink } from "node:fs/promises";
import {
  importProductsFromFullFile,
  InvalidImportFileError,
} from "./imports.simple.services";

export const simpleImportController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await importProductsFromFullFile(req.file.path);

    res.status(200).json({
      message: "File uploaded successfully",
      imported: result.imported,
    });
  } catch (error) {
    if (error instanceof InvalidImportFileError) {
      return res.status(400).json({
        message: error.message,
        errors: error.errors,
      });
    }

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
