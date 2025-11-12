/**
 * HTTP Server abstraction interface
 *
 * NOTE: Currently using Express types directly (Request, Response) instead of
 * abstract interfaces (IHttpRequest, IHttpResponse) for performance and simplicity.
 * This creates a framework dependency on Express, but removes adapter overhead on every request.
 *
 * If framework-agnostic support is needed in the future, we can reintroduce
 * the abstraction layer with IHttpRequest/IHttpResponse interfaces and adapters.
 */
import type { Request, Response, NextFunction } from "express";

export type HttpHandler = (req: Request, res: Response) => Promise<void> | void;

export type HttpMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface IHttpServer {
  get(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void;
  post(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void;
  put(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void;
  delete(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void;
  use(middleware: HttpMiddleware): void;
  listen(port: number, callback?: () => void): void;
}
