import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGitHubAuth,
  handleGitHubCallback,
  handleGetRepositories,
  handleGetRepositoryFiles,
  handleGetFileContent,
  handleCreatePullRequest,
} from "./routes/github";
import {
  handleGenerateTestSummaries,
  handleGenerateTestCode,
} from "./routes/ai";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // GitHub integration routes
  app.get("/api/github/auth", handleGitHubAuth);
  app.post("/api/github/callback", handleGitHubCallback);
  app.get("/api/github/repositories", handleGetRepositories);
  app.get("/api/github/repos/:owner/:repo/contents", handleGetRepositoryFiles);
  app.get(
    "/api/github/repos/:owner/:repo/contents/:path",
    handleGetFileContent,
  );
  app.post("/api/github/repos/:owner/:repo/pulls", handleCreatePullRequest);

  // AI service routes
  app.post("/api/ai/generate-summaries", handleGenerateTestSummaries);
  app.post("/api/ai/generate-code", handleGenerateTestCode);

  return app;
}
