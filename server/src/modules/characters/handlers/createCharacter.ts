import { createHandler } from "templates/handler";

const CreateCharacterHandler = createHandler(
  "/",
  function({ DBs, Utils }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { data = null } = req.body;
        
        if(!data) {
          statusCode = 400;
          throw new Error("Data of charater is empty.");
        }

        let result = await DBs.CaroGameDB.Character.createCharacter(data);
        
        if((result as any).$$error) {
          statusCode = 400;
          throw new Error((result as any).$$error);
        }

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result, "Character is created successfully.")
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

export default CreateCharacterHandler;