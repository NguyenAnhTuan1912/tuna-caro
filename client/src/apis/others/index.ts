import { API_ROOT } from 'src/utils/constant';

// Import types
import { HTTPResponse } from '../apis.types';

async function getRandomID(): Promise<HTTPResponse<{ id: string }>> {
  const response = await fetch(API_ROOT);
  return response.json();
}

export const OtherAPIs = {
  getRandomID
};