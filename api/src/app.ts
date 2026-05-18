import express from "express";
import cors from "cors";
import { userRouter } from "./modules/user/user.router";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5617",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "all good",
  });
});

app.use("/users", userRouter);
