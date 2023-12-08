import { createHandler } from "templates/handler";

const GetCharactersHandler = createHandler(
  "/",
  function({ DBs, Utils }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { name, reg, limit, skip } = req.query;

        let characters = await DBs.CaroGameDB.Character.getCharacters(
          { name, reg } as { name: string, reg: string },
          { limit: parseInt(limit as string), skip: parseInt(skip as string) } as { limit: number, skip: number }
        );
        
        if(!characters) {
          statusCode = 404;
          throw new Error("Characters not found.");
        };

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, characters, "Characters found.")
        );
      } catch (error: any) {
        return Utils.RM.responseJSON(
          res,
          Utils.HTTPCodes[statusCode].code,
          Utils.RM.getResponseMessage(true, undefined, Utils.HTTPCodes[statusCode].title + ": " + error.message)
        );
      }
    }
  }
);

export default GetCharactersHandler;