import { Request, Response } from "express";

export interface ResponseMessage {
  isError: boolean,
  code?: number,
  data?: any
  message?: string
}

/**
 * Use to create a response message objects.
 * @param isError Is error?
 * @param data Data of response message.
 * @param message Content of response message.
 * @returns 
 */
function getResponseMessage(isError = false, data: any, message: string) {
  return {
    isError,
    data,
    message
  }
}

/**
 * Use `res` (Express Response Object) to response to client.
 * @param res 
 * @param status 
 * @param responseMessage 
 * @returns 
 */
function responseJSON(res: Response, status: number, responseMessage: ResponseMessage) {
  responseMessage.code = status;
  return res.status(status).json(responseMessage);
}

export const RM = {
  getResponseMessage,
  responseJSON
}