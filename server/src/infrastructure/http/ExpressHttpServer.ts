import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type {
  IHttpServer,
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

  get(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void {
    if (handlers.length === 0) {
      throw new Error("At least one handler or middleware is required");
    }

    const wrapped = handlers.map((h) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (h.length === 3) {
            await (h as HttpMiddleware)(req, res, next);
          } else {
            await (h as HttpHandler)(req, res);
          }
        } catch (error) {
          next(error);
        }
      };
    });

    this.app.get(path, ...wrapped);
  }

  post(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void {
    if (handlers.length === 0) {
      throw new Error("At least one handler or middleware is required");
    }

    const wrapped = handlers.map((h) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (h.length === 3) {
            await (h as HttpMiddleware)(req, res, next);
          } else {
            await (h as HttpHandler)(req, res);
          }
        } catch (error) {
          next(error);
        }
      };
    });

    this.app.post(path, ...wrapped);
  }

  put(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void {
    if (handlers.length === 0) {
      throw new Error("At least one handler or middleware is required");
    }

    const wrapped = handlers.map((h) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (h.length === 3) {
            await (h as HttpMiddleware)(req, res, next);
          } else {
            await (h as HttpHandler)(req, res);
          }
        } catch (error) {
          next(error);
        }
      };
    });

    this.app.put(path, ...wrapped);
  }

  delete(path: string, ...handlers: (HttpMiddleware | HttpHandler)[]): void {
    if (handlers.length === 0) {
      throw new Error("At least one handler or middleware is required");
    }

    const wrapped = handlers.map((h) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (h.length === 3) {
            await (h as HttpMiddleware)(req, res, next);
          } else {
            await (h as HttpHandler)(req, res);
          }
        } catch (error) {
          next(error);
        }
      };
    });

    this.app.delete(path, ...wrapped);
  }

  use(middleware: HttpMiddleware): void {
    this.app.use(middleware);
  }

  listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }
}
