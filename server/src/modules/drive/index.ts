import { createRouter } from "templates/router";

const base = "/drive";

// Import handlers
import GetListFilesHandler from "./handlers/getListFiles";
import GetContentOfFileHandler from "./handlers/getContentOfFile";
import GetListFoldersHandler from "./handlers/getListFolders";

const GoogleDriveRouter = createRouter({
  handlers: [
    {
      method: "get",
      path: base + GetListFilesHandler.path,
      fns: [GetListFilesHandler.handler]
    },
    {
      method: "get",
      path: base + GetContentOfFileHandler.path,
      fns: [GetContentOfFileHandler.handler]
    },
    {
      method: "get",
      path: base + GetListFoldersHandler.path,
      fns: [GetListFoldersHandler.handler]
    }
  ]
});

export default GoogleDriveRouter;