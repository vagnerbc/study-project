import { Request, Response } from "express";

import { Worker } from "node:worker_threads";

export class WorkerThreadsController {
  calcWithoutWorkerThreads(req: Request, res: Response) {
    console.time("calc");
    const startTime = Date.now();
    const result = heavyCalculation();
    console.timeEnd("calc");

    res.status(200).json({
      message: result,
      time: Date.now() - startTime,
    });
  }

  calc(req: Request, res: Response) {
    console.time("calc");
    const startTime = Date.now();

    const worker = new Worker("./src/modules/workerThreads/heavy-worker.js", {
      workerData: {
        number: 100_000_000_000,
      },
    });

    worker.on("message", (result) => {
      console.timeEnd("calc");

      res.status(200).json({
        message: result,
        time: Date.now() - startTime,
      });
    });

    worker.on("error", (error) => {
      console.error(error);
      res.status(400).json({
        message: "Error on calc",
      });
    });
  }
}

function heavyCalculation() {
  let total = 0;

  for (let i = 0; i < 100_000_000_000; i++) {
    total += i;
  }

  return total;
}
