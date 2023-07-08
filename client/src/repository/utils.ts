export function getNumberFromUrl(url: string): string {
    const start = url.lastIndexOf("/") + 1; // Find the index of the last slash
    const end = url.lastIndexOf("."); // Find the index of the dot before the extension
    const number = url.substring(start, end); // Extract the substring between the last slash and the dot
    return number;
}