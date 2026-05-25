import { Router } from "express";
import { WorkerThreadsController } from "./threads.controler";

const router = Router();
const workerThreadsController = new WorkerThreadsController();

router.get("/", workerThreadsController.calc);
router.get(
  "/calcWithoutWorkerThreads",
  workerThreadsController.calcWithoutWorkerThreads,
);

export { router as workerThreadsRouter };
