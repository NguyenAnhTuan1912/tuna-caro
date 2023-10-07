import { createHandler } from "templates/handler";

const UpdatePostHandler = createHandler(
  "",
  ({ DBs, Utils }) => {
    return async function(req, res) {
      try {
        let query = req.query;
        let id = query.id;

        console.log("Req's Body ~ file updatePost.js ~ line:11: ", req.body);
        console.log("Req's Query ~ file updatePost.js ~ line:12: ", query);

        let result = await DBs.Temp_ADB.Post.find(id);

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result, "Update post successfully.")
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
)

export default UpdatePostHandler;