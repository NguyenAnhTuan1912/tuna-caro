export function configureGetContentOfFileByIdAsync(endpoint: string) {
  /**
   * Use this function to get content of a file in Google Drive by its id.
   * @param id
   */
  return async function getContentOfFileByIdAsync(id: string) {
    let url = endpoint + "/" + id;
    let res = await fetch(url);
    return res.json();
  };
};