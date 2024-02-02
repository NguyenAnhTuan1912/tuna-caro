"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
const express_1 = require("express");
/**
 * This template use to create Express Router.
 */
function createRouter(options) {
  const router = (0, express_1.Router)();
  const { handlers } = options;
  for (let handler of handlers) {
    switch (handler.method) {
      case "get":
        {
          router.route(handler.path).get(...handler.fns);
          break;
        }
        ;
      case "post":
        {
          router.route(handler.path).post(...handler.fns);
          break;
        }
        ;
      case "delete":
        {
          router.route(handler.path).delete(...handler.fns);
          break;
        }
        ;
      case "put":
        {
          router.route(handler.path).put(...handler.fns);
          break;
        }
        ;
      case "patch":
        {
          router.route(handler.path).patch(...handler.fns);
          break;
        }
        ;
    }
  }
  return router;
}
exports.createRouter = createRouter;