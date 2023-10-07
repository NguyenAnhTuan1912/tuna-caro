import { createRouter } from "templates/router";

// const GetPost = require("./getPost");
// const CreatePost = require("./createPost");
// const DeletePost = require("./deletePost");
// const UpdatePost = require("./updatePost");

// const GetPosts = require("./getPosts");
import GetPostHandler from "./handlers/getPost";
import CreatePostHandler from "./handlers/createPost";
import DeletePostHandler from "./handlers/deletePost";
import UpdatePostHandler from "./handlers/updatePost";
import GetPostsHandler from "./handlers/getPosts";

const base = {
  post: "/post",
  posts: "/posts"
};

const PostRouter = createRouter({
  handlers: [
    // GET
    {
      path: base.post + GetPostHandler.path,
      method: "get",
      fns: [GetPostHandler.handler]
    },
    {
      path: base.posts + GetPostsHandler.path,
      method: "get",
      fns: [GetPostsHandler.handler]
    },
    // POST
    {
      path: base.post + CreatePostHandler.path,
      method: "post",
      fns: [CreatePostHandler.handler]
    },
    // DELETE
    {
      path: base.post + DeletePostHandler.path,
      method: "delete",
      fns: [DeletePostHandler.handler]
    },
    // PUT
    {
      path: base.post + UpdatePostHandler.path,
      method: "put",
      fns: [UpdatePostHandler.handler]
    }
  ]
});

export default PostRouter;