"use strict";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {return value instanceof P ? value : new P(function (resolve) {resolve(value);});}
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
    function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
    function step(result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriveAPICallers = void 0;
const googleapis_1 = require("googleapis");
// Import utils
const utils_1 = __importDefault(require("../../../utils"));
const utils_2 = require("../utils");
/**
 * Use to get API Caller for specific task.
 * @param oauth2Client
 * @returns
 */
function getDriveAPICallers(oauth2Client, drive) {
  if (!drive)
  drive = googleapis_1.google.drive({
    version: "v3",
    auth: oauth2Client
  });
  return {
    /**
     * Use this function to get information of file with its `id`. Can be use to get file content with `alt = "media"`.
     *
     * Experiment successfully: `json`
     * @param id
     * @param alt
     * @returns
     */
    getFileByIdAsync(id, alt) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          if (!id)
          throw new Error("Get file's information require file's id.");
          const res = yield drive.files.get({
            fileId: id,
            alt: alt ? alt : "json"
          });
          return res.data;
        }
        catch (error) {
          return utils_1.default.RM.reportError(error.message, "listFilesInfoAsync");
        }
      });
    },
    /**
     * Use this function to get list of files in drive.
     * @returns
     */
    listFilesAsync(opt) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          let q = "";
          // If `opt` has fileName.
          if (opt && opt.fileName) {
            q = utils_2.GDriveUtils.getNameForQuery(opt.fileName);
          }
          ;
          const res = yield drive.files.list({
            q
          });
          return res.data;
        }
        catch (error) {
          return utils_1.default.RM.reportError(error.message, "listFilesInfoAsync");
        }
      });
    },
    /**
     * Use this function to get information of list of folder.
     * @returns
     */
    listFoldersInfoAysnc() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield drive.files.list({
            q: utils_2.GDriveUtils.getFolderQuery()
          });
          return res.data;
        }
        catch (error) {
          return utils_1.default.RM.reportError(error.message, "listFilesInfoAsync");
        }
      });
    },
    /**
     * Use to get all content (files & folders) in a folder by its name.
     * @param folderName
     * @returns
     */
    listFolderContentByNameAsync(opt) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const foldersRes = yield drive.files.list({
            q: utils_2.GDriveUtils.getFoldersByNameQuery(opt.folderName)
          });
          if (!foldersRes.data.files)
          throw new Error("Folder is empty.");
          const folder = foldersRes.data.files[0];
          let q = utils_2.GDriveUtils.getInParentsWithIDQuery(folder.id);
          // If `opt` has fileName
          if (opt.fileName) {
            q = utils_2.GDriveUtils.mergeQuery(q, utils_2.GDriveUtils.getNameForQuery(opt.fileName));
          }
          ;
          const res = yield drive.files.list({
            q
          });
          return res.data;
        }
        catch (error) {
          return utils_1.default.RM.reportError(error.message, "listFilesInfoAsync");
        }
      });
    }
  };
}
exports.getDriveAPICallers = getDriveAPICallers;