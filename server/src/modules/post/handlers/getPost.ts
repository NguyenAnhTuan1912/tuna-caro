import { createHandler } from "templates/handler";

// console.log("Utils ~ modules/post/getPost.js ~ line:3: ", Utils);

const GetPostHandler = createHandler(
  "",
  ({ DBs, Utils }) => {
    return async function(req, res) {
      try {
        let query = req.query;
        let id = query.id;

        let result = await DBs.Temp_ADB.Post.find(id);

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result, "Get post successfully.")
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

export default GetPostHandler;