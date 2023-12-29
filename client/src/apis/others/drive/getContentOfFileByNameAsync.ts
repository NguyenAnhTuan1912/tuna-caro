export function configureGetContentOfFileByNameAsync(endpoint: string) {
  /**
   * Use this function to get content of a file in Google Drive by folder's name and its name.
   * @param id
   */
  return async function getContentOfFileByNameAsync(folder: string, fileName: string) {
    let url = endpoint + "/" + folder + "/" + fileName;
    let res = await fetch(url);
    return res.json();
  };
};