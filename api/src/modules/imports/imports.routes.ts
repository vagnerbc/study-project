import { Router } from "express";
import { upload } from "../../middlewares/multerMiddleware";
import { simpleImportController } from "./imports.simple.controller";
import { simpleImportStreamController } from "./imports.simple.stream.controller";

const router = Router();

router.post("/simple-import", upload.single("file"), simpleImportController);

router.post(
  "/simple-import-stream",
  upload.single("file"),
  simpleImportStreamController,
);

export { router as importsRouter };
