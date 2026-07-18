import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = await createApp();
  const server = createServer(app);

  // In development, setup Vite HMR middleware which requires the server instance
  if (process.env.NODE_ENV === "development") {
    try {
      await setupVite(app, server);
    } catch (e) {
      console.warn("Failed to setup Vite middleware:", e);
    }
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

/**
 * Create and configure the Express app without starting a listener.
 * This allows exporting a handler for serverless platforms (Vercel)
 * while preserving the ability to start a standalone server locally.
 */
export async function createApp() {
  const app = express();
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    // setupVite expects both app and server; in dev mode when running
    // as a standalone server, startServer calls setupVite with a real server.
    // For serverless environments we don't run dev mode there.
    // If someone calls createApp in dev without a server, skip setupVite.
  } else {
    serveStatic(app);
  }

  // Lightweight healthcheck for hosting platforms
  app.get("/_health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  return app;
}

// Default export: Vercel and other serverless platforms will import this
// module and invoke the exported handler. The handler delegates to the
// Express `app` created by `createApp()`.
export default async function handler(req: any, res: any) {
  const app = await createApp();
  return app(req, res);
}

// When not running on Vercel (local development or other hosts), start
// the standalone server to listen on a port.
if (!process.env.VERCEL) {
  startServer().catch(console.error);
}
