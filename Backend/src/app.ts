import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes";
import "./services/passport";

export const createApp = () => {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later" },
  });
  app.use(limiter);

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Passport
  app.use(passport.initialize());

  // API routes
  app.use("/api/v1", routes);

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Server is running", timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
