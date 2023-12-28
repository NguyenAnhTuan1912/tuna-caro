import { createHandler } from "templates/handler";

const DeleteCharacterHandler = createHandler(
  "/",
  function({ DBs, Utils }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { id } = req.body;
        
        if(!id) {
          statusCode = 400;
          throw new Error("Id must be knew.");
        }

        let result = await DBs.CaroGameDB.Character.deleteCharacter({ id });
        
        if("$$error" in result) {
          statusCode = 400;
          throw new Error(result.$$error);
        };

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result, "Character is deleted successfully.")
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

export default DeleteCharacterHandler;