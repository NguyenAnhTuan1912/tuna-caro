import { Request, Response, NextFunction } from "express";

// Import databases
import CaroGameDB from "db/carogame";

// Import services
import { GoogleService, GoogleServiceType } from "services/google";

// Import utils
import utils from "utils";

// Import types
import { APIHandler } from "types";

// Internal Types
type A = typeof utils;
interface Utils extends A {}
interface DBs {
  CaroGameDB: CaroGameDB
}

interface HandlerCBProps {
  DBs: DBs,
  Utils: Utils,
  Services: {
    Google: GoogleServiceType
  }
};

type CreateHandlerCallBack = (props: HandlerCBProps) => (req: Request, res: Response, next?: NextFunction) => Promise<any>
type CreateExtraArgsHandlerCallBack<T> = (props: HandlerCBProps, args?: T) => (req: Request, res: Response, next?: NextFunction) => Promise<any>

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
export function createHandler(
  path: string,
  cb: CreateHandlerCallBack
): APIHandler {
  // Declare Database Objects for call back.
  const DBs = {
    CaroGameDB: new CaroGameDB()
  };

  // Declare props for call back.
  const callBackProps: HandlerCBProps = {
    DBs: DBs,
    Utils: utils,
    Services: {
      Google: GoogleService
    }
  };

  return {
    path,
    handler: cb(callBackProps)
  }
}

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
export function createExtraArgsHandler<T>(
  path: string,
  cb: CreateExtraArgsHandlerCallBack<T>
) {
  // Declare Database Objects for call back.
  const DBs = {
    CaroGameDB: new CaroGameDB()
  };

  // Declare props for call back.
  const callBackProps: HandlerCBProps = {
    DBs: DBs,
    Utils: utils,
    Services: {
      Google: GoogleService
    }
  };

  return {
    path,
    handler: function(args?: T) { return cb(callBackProps, args); }
  }
}