"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDriveUtils = void 0;
// Import from constant
const constant_1 = require("../../../constant");
/**
 * Use this function to get query string for folder.
 * @returns
 */
function getFolderQuery() {
  return `mimeType = "${constant_1.CONST.GOOGLE_DRIVE.MIMETYPE.FOLDER}"`;
}
/**
 * Use this function to get query string for file.
 * @returns
 */
function getFileQuery() {
  return `mimeType = "${constant_1.CONST.GOOGLE_DRIVE.MIMETYPE.FILE}"`;
}
/**
 * Use this function to get query string about `name`.
 * @param name
 * @returns
 */
function getNameForQuery(name) {
  return `name contains "${name}"`;
}
/**
 * Use this function to get query string for folders by `folderName`.
 * @param folderName
 */
function getFoldersByNameQuery(folderName) {
  return mergeQuery(getNameForQuery(folderName), getFolderQuery());
}
/**
 * Use this function to get query string for files by `fileName`.
 * @param fileName
 */
function getFilesByNameQuery(fileName) {
  return mergeQuery(getNameForQuery(fileName), getFileQuery());
}
/**
 * Use this function to get query string for a list of content of specific ID.
 * @param id
 */
function getInParentsWithIDQuery(id) {
  return `parents in "${id}"`;
}
/**
 * Use this function to merge all queries string.
 * @param queries
 */
function mergeQuery(...queries) {
  return queries.join(" and ");
}
exports.GDriveUtils = {
  getFolderQuery,
  getFileQuery,
  getNameForQuery,
  getFoldersByNameQuery,
  getFilesByNameQuery,
  mergeQuery,
  getInParentsWithIDQuery
};