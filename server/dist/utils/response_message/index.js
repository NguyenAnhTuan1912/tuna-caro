"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RM = void 0;
/**
 * Use this function to create a response message objects.
 * @param isError Is error?
 * @param data Data of response message.
 * @param message Content of response message.
 * @returns
 */
function getResponseMessage(isError = false, data, message) {
  return {
    isError,
    data,
    message
  };
}
/**
 * Use `res` (Express Response Object) to response to client.
 * @param res
 * @param status
 * @param responseMessage
 * @returns
 */
function responseJSON(res, status, responseMessage) {
  responseMessage.code = status;
  return res.status(status).json(responseMessage);
}
/**
 * Use this function to create an error report when has an error. For internal use.
 * @param error
 * @param from
 * @returns
 */
function reportError(error, from) {
  return { $$error: error, from };
}
exports.RM = {
  getResponseMessage,
  responseJSON,
  reportError
};