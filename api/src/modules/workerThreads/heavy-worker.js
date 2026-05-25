import { parentPort, workerData } from "node:worker_threads";

let total = 0;

for (let i = 0; i < workerData.number; i++) {
  total += i;
}

parentPort?.postMessage(total);
