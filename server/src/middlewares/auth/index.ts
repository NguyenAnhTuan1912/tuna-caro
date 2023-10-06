import { createExtraArgsHandler } from "templates/handler";

import { UserRoles } from "types";

const AuthMWHandler = createExtraArgsHandler<{ role: UserRoles }>(
  "",
  ({ DBs, Utils }, agrs) => {
    return async function(req, res, next) {
      let statusCode = 500;
      try {
        // Set default args.role is user
        agrs = Object.assign(
          {
            role: "user"
          },
          agrs
        );

        const authorization = req.headers.authorization;

        if(!authorization) {
          statusCode = 401;
          throw new Error("You need to be authorized first.");
        }

        const [type, token] = authorization.split(" ");
        const verified = Utils.Security.verify(token) as { scope: string, role: UserRoles };
        
        if(!verified) {
          statusCode = 400;
          throw new Error("Invalid token.");
        };

        if(Utils.Security.scopes[agrs.role] !== verified.scope) {
          statusCode = 403;
          throw new Error("You don't have permission to do this action.");
        }

        return next!();
      } catch (error: any) {
        console.error("Auth Error: ", error);
        return Utils.RM.responseJSON(
          res,
          statusCode,
          Utils.RM.getResponseMessage(true, undefined, Utils.HTTPCodes[statusCode].title + ": " + error.message)
        );
      }
    }
  }
);

export default AuthMWHandler;