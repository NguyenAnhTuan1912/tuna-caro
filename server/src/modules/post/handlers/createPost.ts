import { createHandler } from "templates/handler";

const CreatePostHandler = createHandler(
  "",
  ({ DBs, Utils }) => {
    return async function(req, res) {
      try {
        let body = req.body;
        let data = {
          name: body.name,
          author: body.author,
          type: body.type,
          date: (new Date(body.date)).getTime()
        }
        
        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, data, "Create post successfully.")
        );
      } catch (error: any) {
        return Utils.RM.responseJSON(
          res,
          500,
          Utils.RM.getResponseMessage(true, undefined, error.message)
        );
      }
    }
  }
);

export default CreatePostHandler;