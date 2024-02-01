"use strict";
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../templates/router");
const base = "/drive";
// Import handlers
const getListFiles_1 = __importDefault(require("./handlers/getListFiles"));
const getContentOfFileById_1 = __importDefault(require("./handlers/getContentOfFileById"));
const getListFolders_1 = __importDefault(require("./handlers/getListFolders"));
const getContentOfFileByName_1 = __importDefault(require("./handlers/getContentOfFileByName"));
const GoogleDriveRouter = (0, router_1.createRouter)({
  handlers: [
  {
    method: "get",
    path: base + getListFiles_1.default.path,
    fns: [getListFiles_1.default.handler]
  },
  {
    method: "get",
    path: base + getContentOfFileById_1.default.path,
    fns: [getContentOfFileById_1.default.handler]
  },
  {
    method: "get",
    path: base + getListFolders_1.default.path,
    fns: [getListFolders_1.default.handler]
  },
  {
    method: "get",
    path: base + getContentOfFileByName_1.default.path,
    fns: [getContentOfFileByName_1.default.handler]
  }]

});
exports.default = GoogleDriveRouter;