import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { userRouter } from "./modules/user/user.router";
import helmet from "helmet";
import morgan from "morgan";
import { logger, requestTracking } from "./middlewares/requestTracking";
import { sequelize } from "./infra/database/sequelize";
import { RedisClient } from "./infra/cache/redis";
import { pinoHttp } from "pino-http";
import { workerThreadsRouter } from "./modules/workerThreads/threads.router";

export const app = express();

const httpLogger = pinoHttp({
  logger: logger,
});

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5617",
  }),
);

app.use(express.json());
// app.use(morgan("dev"));
app.use(httpLogger);
// app.use(requestTracking);

app.get("/health", async (req, res) => {
  try {
    await sequelize.query("select 1");
    await RedisClient.ping();

    res.json({
      status: "ok",
      database: "ok",
      redis: "ok",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
    });
  }
});

app.use("/users", userRouter);
app.use("/worker-threads", workerThreadsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
