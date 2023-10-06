import { Request, Response, Router, NextFunction } from "express";

import { HTTPMethods } from "types";

interface CreateRouterOptions {
  handlers: Array<{
    path: string,
    method: HTTPMethods,
    fns: Array<(req: Request, res: Response, next?: NextFunction) => any>
  }>
}

/**
 * This template use to create Express Router.
 */
export function createRouter(options: CreateRouterOptions) {
  const router = Router();
  const { handlers } = options;

  for(let handler of handlers) {
    switch(handler.method) {
      case "get": {
        router.route(handler.path).get(...handler.fns);
        break;
      };

      case "post": {
        router.route(handler.path).post(...handler.fns);
        break;
      };

      case "delete": {
        router.route(handler.path).delete(...handler.fns);
        break;
      };

      case "put": {
        router.route(handler.path).put(...handler.fns);
        break;
      };

      case "patch": {
        router.route(handler.path).patch(...handler.fns);
        break;
      };
    }
  }

  return router;
}