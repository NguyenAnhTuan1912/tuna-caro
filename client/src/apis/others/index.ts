import { API_ROOT } from 'src/utils/constant';

const API_URL = API_ROOT + "/api";

// Import types
import { HTTPResponse, RequestOptions } from '../apis.types';
import { CharacterType } from 'src/types/character.types';

/**
 * Use this function to get random ID from server.
 * @returns 
 */
async function getRandomIDAsync(): Promise<HTTPResponse<{ id: string }>> {
  const response = await fetch(API_URL);
  return response.json();
}

/**
 * Use this function to a list of character.
 * @param options 
 * @returns 
 */
async function getCharactersAsync(opt?: RequestOptions): Promise<HTTPResponse<Array<CharacterType>>> {
  let queryStr = "";

  if(opt && opt.query) {
    queryStr = "?" + new URLSearchParams(opt.query);;
  }

  let url = API_URL + "/characters" + queryStr;
  const response = await fetch(url);
  return response.json();
}

/**
 * Use this function to get information of a character.
 * @param opt 
 * @returns 
 */
async function getCharacterAsync(opt: RequestOptions) {
  let url = API_URL + "/character" +"?" + new URLSearchParams(opt.query);
  const response = await fetch(url);
  return response.json();
}

export const OtherAPIs = {
  getRandomIDAsync,
  getCharactersAsync,
  getCharacterAsync
};