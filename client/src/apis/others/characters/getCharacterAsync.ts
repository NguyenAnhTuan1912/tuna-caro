// Import types
import { HTTPResponse, RequestOptions } from '../../apis.types';
import { CharacterType } from 'src/types/character.types';

export function configureGetCharacterAsync(endpoint: string) {
  /**
   * Use this function to get information of a character.
   * @param opt 
   * @returns 
   */
  return async function getCharacterAsync(opt: RequestOptions): Promise<HTTPResponse<CharacterType>> {
    let url = endpoint +"?" + new URLSearchParams(opt.query);
    const response = await fetch(url);
    return response.json();
  };
}