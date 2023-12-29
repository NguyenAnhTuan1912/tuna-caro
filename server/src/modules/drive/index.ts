import { createRouter } from "templates/router";

const base = "/drive";

// Import handlers
import GetListFilesHandler from "./handlers/getListFiles";
import GetContentOfFileByIdHandler from "./handlers/getContentOfFileById";
import GetListFoldersHandler from "./handlers/getListFolders";
import GetContentOfFileByNameHandler from "./handlers/getContentOfFileByName";

const GoogleDriveRouter = createRouter({
  handlers: [
    {
      method: "get",
      path: base + GetListFilesHandler.path,
      fns: [GetListFilesHandler.handler]
    },
    {
      method: "get",
      path: base + GetContentOfFileByIdHandler.path,
      fns: [GetContentOfFileByIdHandler.handler]
    },
    {
      method: "get",
      path: base + GetListFoldersHandler.path,
      fns: [GetListFoldersHandler.handler]
    },
    {
      method: "get",
      path: base + GetContentOfFileByNameHandler.path,
      fns: [GetContentOfFileByNameHandler.handler]
    }
  ]
});

export default GoogleDriveRouter;