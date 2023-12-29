// Import types
import { HTTPResponse, RequestOptions } from '../../apis.types';
import { CharacterType } from 'src/types/character.types';

export function configureGetCharactersAsync(endpoint: string) {
  /**
   * Use this function to a list of character.
   * @param options 
   * @returns 
   */
  return async function getCharactersAsync(opt?: RequestOptions): Promise<HTTPResponse<Array<CharacterType>>> {
    let queryStr = "";
  
    if(opt && opt.query) {
      queryStr = "?" + new URLSearchParams(opt.query);;
    }
  
    let url = endpoint + queryStr;

    const response = await fetch(url);
    return response.json();
  };
};