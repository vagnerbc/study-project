import multer from "multer";
import { mkdirSync } from "node:fs";

const UPLOAD_DIR = "/tmp/my-uploads";
const CSV_MIME_TYPES = new Set([
  "text/csv",
  "text/plain",
  "application/csv",
  "application/vnd.ms-excel",
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const isCsvExtension = file.originalname.toLowerCase().endsWith(".csv");

  if (isCsvExtension && CSV_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
};

export const upload = multer({ storage: storage, limits, fileFilter });
