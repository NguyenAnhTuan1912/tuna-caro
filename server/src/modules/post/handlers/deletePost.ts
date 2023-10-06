import { createHandler } from "templates/handler";

const DeletePostHandler = createHandler(
  "",
  ({ DBs, Utils }) => {
    return async function(req, res) {
      try {
        let query = req.query;
        let id = query.id;

        console.log("Req's Body ~ file deletePost.js ~ line:11: ", req.body);
        console.log("Req's Query ~ file deletePost.js ~ line:12: ", query);

        let result = await DBs.Temp_ADB.Post.find(id);

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result, "Delete post successfully.")
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

export default DeletePostHandler;