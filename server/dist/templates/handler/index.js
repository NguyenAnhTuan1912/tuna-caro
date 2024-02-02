"use strict";
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExtraArgsHandler = exports.createHandler = void 0;
// Import databases
const carogame_1 = __importDefault(require("../../db/carogame"));
// Import services
const google_1 = require("../../services/google");
// Import utils
const utils_1 = __importDefault(require("../../utils"));
;
/**
 * This template use to create API Handlers. It receive a call back, this callback receive some
 * global objects in an `object` like:
 * - `DBs`: a list of Databases are set up. Use to communicate with Database.
 * - `utils`: a list of helper functions are used to do some actions.
 * - `services`: a list of services.
 *
 * Will be updated in future.
 *
 * Return a api handler.
 * @param cb
 * @returns
 * @example
 * ```
 * // somemw.ts
 * import { createHandler } from "templates/handler";
 *
 * const SomeMWHandler = createHandler(
 *   "",
 *   ({ DBs, Utils }) => {
 *     return async function(req, res) {
 *       // Do here
 *     }
 *   }
 * );
 *
 * // somerouter.ts
 * import SomeMWHandler from "middlewares/somemw";
 *
 * const SomeRouter = createRouter({
 *   handlers: [
 *     {
 *       path: base.url + SomeHandler.path,
 *       method: "post",
 *       fns: [somemw.handler, SomeHandler.handler]
 *     }
 *   ]
 * });
 * ```
 */
function createHandler(path, cb) {
  // Declare Database Objects for call back.
  const DBs = {
    CaroGameDB: new carogame_1.default()
  };
  // Declare props for call back.
  const callBackProps = {
    DBs: DBs,
    Utils: utils_1.default,
    Services: {
      Google: google_1.GoogleService
    }
  };
  return {
    path,
    handler: cb(callBackProps)
  };
}
exports.createHandler = createHandler;
/**
 * Use to create a handler. It receive a call back, this callback receive some
 * global objects in an `object` like:
 * - `DBs`: a list of Databases are set up. Use to communicate with Database.
 * - `utils`: a list of helper functions are used to do some actions.
 * - `services`: a list of services.
 *
 * Have extra arguments by wrap the handler inside a function, this function receive arguments.
 *
 * Will be updated in future.
 *
 * Its return a function that it returns a api handler, because of extra args, you need to call and pass args to it.
 * @param path
 * @param cb
 * @returns
 * @example
 * ```
 * // somemw.ts
 * import { createExtraArgsHandler } from "templates/handler";
 *
 * const SomeMWExtraArgsHandler = createExtraArgsHandler<{ scope: string }>(
 *   "",
 *   (_, args) => {
 *     return async function(req, res) {
 *       // Do here
 *       console.log(args.scope);
 *       console.log(_) // Output: { DBs [Object object], Utils: [Object object], Services: [Object object] };
 *     }
 *   }
 * );
 *
 * // somerouter.ts
 * import SomeMWExtraArgsHandler from "middlewares/somemw";
 *
 * const SomeRouter = createRouter({
 *   handlers: [
 *     {
 *       path: base.url + SomeHandler.path,
 *       method: "post",
 *       fns: [SomeMWExtraArgsHandler.handler({ scope: "admin" }), SomeHandler.handler]
 *     }
 *   ]
 * });
 * ```
 */
function createExtraArgsHandler(path, cb) {
  // Declare Database Objects for call back.
  const DBs = {
    CaroGameDB: new carogame_1.default()
  };
  // Declare props for call back.
  const callBackProps = {
    DBs: DBs,
    Utils: utils_1.default,
    Services: {
      Google: google_1.GoogleService
    }
  };
  return {
    path,
    handler: function (args) {return cb(callBackProps, args);}
  };
}
exports.createExtraArgsHandler = createExtraArgsHandler;