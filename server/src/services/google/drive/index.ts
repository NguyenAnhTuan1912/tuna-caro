import { google, drive_v3 } from "googleapis";

// Import constant
import { CONST } from "constant";

// Import utils
import Utils from "utils";
import { GDriveUtils } from "../utils";

export type ListFilesOptionsType = {
  fileName?: string;
};

export type ListFolderConentByNameOptionsType = {
  folderName: string;
  fileName?: string;
};

/**
 * Use to get API Caller for specific task.
 * @param oauth2Client 
 * @returns 
 */
export function getDriveAPICallers(oauth2Client: any, drive?: drive_v3.Drive) {
  if(!drive)
    drive = google.drive({
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
    async getFileInfoByIdAsync<T extends string = "json" | "media">(id: string, alt?: T) {
      try {
        if(!id) throw new Error("Get file's information require file's id.");

        const res = await drive!.files.get({
          fileId: id,
          alt: alt ? alt : "json"
        });

        return res.data;
      } catch (error: any) {
        return Utils.RM.reportError(error.message, "listFilesInfoAsync")
      }
    },

    /**
     * Use this function to get list of files in drive.
     * @returns 
     */
    async listFilesAsync(opt?: ListFilesOptionsType) {
      try {
        let q = "";

        // If `opt` has fileName.
        if(opt && opt.fileName) {
          q = GDriveUtils.getNameForQuery(opt.fileName);
        };

        const res = await drive!.files.list({
          q
        });

        return res.data;
      } catch (error: any) {
        return Utils.RM.reportError(error.message, "listFilesInfoAsync")
      }
    },

    /**
     * Use this function to get information of list of folder.
     * @returns 
     */
    async listFoldersInfoAysnc() {
      try {
        const res = await drive!.files.list({
          q: GDriveUtils.getFolderQuery()
        });

        return res.data;
      } catch (error: any) {
        return Utils.RM.reportError(error.message, "listFilesInfoAsync")
      }
    },

    /**
     * Use to get all content (files & folders) in a folder by its name.
     * @param folderName 
     * @returns 
     */
    async listFolderContentByNameAsync(opt: ListFolderConentByNameOptionsType) {
      try {
        const foldersRes = await drive!.files.list({
          q: GDriveUtils.getFoldersByNameQuery(opt.folderName)
        });

        if(!foldersRes.data.files) throw new Error("Folder is empty.");

        const folder = foldersRes.data.files[0];
        let q = GDriveUtils.getInParentsWithIDQuery(folder.id!);

        // If `opt` has fileName
        if(opt.fileName) {
          q = GDriveUtils.mergeQuery(q, GDriveUtils.getNameForQuery(opt.fileName))
        };

        const res = await drive!.files.list({
          q
        });

        return res.data;
      } catch (error: any) {
        return Utils.RM.reportError(error.message, "listFilesInfoAsync")
      }
    }
  }
}