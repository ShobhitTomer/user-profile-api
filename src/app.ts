/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import cors from "cors";
import path from "path";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";
import { config } from "./config/config";

const app = express();

app.use(
  cors({
    origin: config.frontendDomain,
  })
);
app.use(express.json());

// Ensure uploads directory exists
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/data/uploads"))
);

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to User Profile Management API" });
});

// Routes
app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
