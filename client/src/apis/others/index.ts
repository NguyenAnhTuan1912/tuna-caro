import { API_ROOT } from 'src/utils/constant';

const API_URL = API_ROOT + "/api";

const ENDPOINTS = {
  CHARACTER: API_URL + "/character",
  CHARACTERS: API_URL + "/characters",
  DRIVE_FILES: API_URL + "/drive/files",
  DRIVE_FOLDERS: API_URL + "/drive/folders"
};

// Import callers
import { configureGetCharacterAsync } from './characters/getCharacterAsync';
import { configureGetCharactersAsync } from './characters/getCharactersAsync';
import { configureListFilesAsync } from './drive/listFilesAsync';
import { configureGetContentOfFileByIdAsync } from './drive/getContentOfFileByIdAsync';
import { configureGetContentOfFileByNameAsync } from './drive/getContentOfFileByNameAsync';

// Import types
import { HTTPResponse } from '../apis.types';

/**
 * Use this function to get random ID from server.
 * @returns 
 */
async function getRandomIDAsync(): Promise<HTTPResponse<{ id: string }>> {
  const response = await fetch(API_ROOT);
  return response.json();
}

export const OtherAPIs = {
  getRandomIDAsync,
  getCharactersAsync: configureGetCharactersAsync(ENDPOINTS.CHARACTERS),
  getCharacterAsync: configureGetCharacterAsync(ENDPOINTS.CHARACTER),
  listFilesAsync: configureListFilesAsync(ENDPOINTS.DRIVE_FILES),
  getContentOfFileByIdAsync: configureGetContentOfFileByIdAsync(ENDPOINTS.DRIVE_FILES),
  getContentOfFileByNameAsync: configureGetContentOfFileByNameAsync(ENDPOINTS.DRIVE_FOLDERS)
};