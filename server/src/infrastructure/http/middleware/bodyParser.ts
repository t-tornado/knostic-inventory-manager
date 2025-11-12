import { json } from "express";
import type { Express } from "express";

/**
 * Express-specific body parser middleware
 * This would be different for Fastify, Koa, etc.
 */
export function setupBodyParser(app: Express): void {
  app.use(json());
}
