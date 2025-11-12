import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type {
  IHttpServer,
  IHttpRequest,
  IHttpResponse,
  HttpHandler,
  HttpMiddleware,
} from "../../presentation/http/IHttpServer";

export class ExpressHttpServer implements IHttpServer {
  private app: Express;

  constructor() {
    this.app = express();
  }

  getExpressApp(): Express {
    return this.app;
  }

  get(path: string, handler: HttpHandler): void {
    this.app.get(path, this.wrapHandler(handler));
  }

  post(path: string, handler: HttpHandler): void {
    this.app.post(path, this.wrapHandler(handler));
  }

  put(path: string, handler: HttpHandler): void {
    this.app.put(path, this.wrapHandler(handler));
  }

  delete(path: string, handler: HttpHandler): void {
    this.app.delete(path, this.wrapHandler(handler));
  }

  use(middleware: HttpMiddleware): void {
    this.app.use(this.wrapMiddleware(middleware));
  }

  listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }

  private wrapHandler(handler: HttpHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(this.adaptRequest(req), this.adaptResponse(res));
      } catch (error) {
        next(error);
      }
    };
  }

  private wrapMiddleware(middleware: HttpMiddleware) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await middleware(this.adaptRequest(req), this.adaptResponse(res), next);
      } catch (error) {
        next(error);
      }
    };
  }

  private adaptRequest(req: Request): IHttpRequest {
    return {
      body: req.body,
      params: req.params,
      query: req.query as Record<string, string | string[] | undefined>,
      headers: req.headers as Record<string, string | string[] | undefined>,
    };
  }

  private adaptResponse(res: Response): IHttpResponse {
    return {
      status: (code: number) => {
        res.status(code);
        return this.adaptResponse(res);
      },
      json: (data: unknown) => {
        res.json(data);
        return this.adaptResponse(res);
      },
      send: (data: string) => {
        res.send(data);
        return this.adaptResponse(res);
      },
      header: (name: string, value: string) => {
        res.header(name, value);
        return this.adaptResponse(res);
      },
    };
  }
}
