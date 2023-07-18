/**
 * Extracts the number from the given URL by finding the substring between the last slash and the dot before the extension.
 * @param url - The URL from which the number should be extracted.
 * @returns The extracted number as a string.
 */
export function getNumberFromUrl(url: string): string {
  const start = url.lastIndexOf("/") + 1; // Find the index of the last slash
  const end = url.lastIndexOf("."); // Find the index of the dot before the extension
  const number = url.substring(start, end); // Extract the substring between the last slash and the dot
  return number;
}
