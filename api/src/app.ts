import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { userRouter } from "./modules/user/user.router";
import helmet from "helmet";
import morgan from "morgan";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5617",
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "all good",
  });
});

app.use("/users", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);
