/**
 * HTTP Server abstraction interface
 * Allows swapping Express with Fastify, Koa, etc.
 */
export interface IHttpRequest {
  body: unknown;
  params: Record<string, string>;
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

export interface IHttpResponse {
  status(code: number): IHttpResponse;
  json(data: unknown): IHttpResponse;
  send(data: string): IHttpResponse;
  header(name: string, value: string): IHttpResponse;
}

export type HttpHandler = (
  req: IHttpRequest,
  res: IHttpResponse
) => Promise<void> | void;
export type HttpMiddleware = (
  req: IHttpRequest,
  res: IHttpResponse,
  next: () => void
) => Promise<void> | void;

export interface IHttpServer {
  get(path: string, handler: HttpHandler): void;
  post(path: string, handler: HttpHandler): void;
  put(path: string, handler: HttpHandler): void;
  delete(path: string, handler: HttpHandler): void;
  use(middleware: HttpMiddleware): void;
  listen(port: number, callback?: () => void): void;
}
