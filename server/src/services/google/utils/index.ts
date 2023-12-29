// Import from constant
import { CONST } from "constant";

/**
 * Use this function to get query string for folder.
 * @returns 
 */
function getFolderQuery() {
  return `mimeType = "${CONST.GOOGLE_DRIVE.MIMETYPE.FOLDER}"`;
}

/**
 * Use this function to get query string for file.
 * @returns 
 */
function getFileQuery() {
  return `mimeType = "${CONST.GOOGLE_DRIVE.MIMETYPE.FILE}"`;
}

/**
 * Use this function to get query string about `name`.
 * @param name
 * @returns 
 */
function getNameForQuery(name: string) {
  return `name contains "${name}"`;
}

/**
 * Use this function to get query string for folders by `folderName`.
 * @param folderName 
 */
function getFoldersByNameQuery(folderName: string) {
  return mergeQuery(getNameForQuery(folderName), getFolderQuery());
}

/**
 * Use this function to get query string for files by `fileName`.
 * @param fileName 
 */
function getFilesByNameQuery(fileName: string) {
  return mergeQuery(getNameForQuery(fileName), getFileQuery());
}

/**
 * Use this function to get query string for a list of content of specific ID.
 * @param id 
 */
function getInParentsWithIDQuery(id: string) {
  return `parents in "${id}"`;
}

/**
 * Use this function to merge all queries string.
 * @param queries 
 */
function mergeQuery(...queries: Array<string>) {
  return queries.join(" and ");
}

export const GDriveUtils = {
  getFolderQuery,
  getFileQuery,
  getNameForQuery,
  getFoldersByNameQuery,
  getFilesByNameQuery,
  mergeQuery,
  getInParentsWithIDQuery
};