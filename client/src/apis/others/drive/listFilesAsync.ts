// Import types
import { HTTPResponse } from "src/apis/apis.types";
import { GoogleDriveFileDataType } from "src/types/apis.types";

export function configureListFilesAsync(endpoint: string) {
  /**
   * Use this function to get a list of files in a folder in Google Drive by its name.
   * @param folderName
   */
  return async function listFilesAsync(folderName: string): Promise<HTTPResponse<Array<GoogleDriveFileDataType>>> {
    let url = endpoint + "?folder=" + folderName;
    let res = await fetch(url);
    return res.json();
  };
}