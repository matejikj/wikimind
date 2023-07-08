import { Session, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { getPodUrlAll } from "@inrupt/solid-client";

const APP_DIR = "WIKIE";
const CLASS_DIR = "classes";
const GRAPH_DIR = "graphs";

/**
 * Checks the structure of the application.
 */
export async function checkStructure() {
  // Get the default session
  const aa: Session = getDefaultSession();
  console.log(aa);

  // Get the URLs of all Pods associated with the user
  const bb = await getPodUrlAll(aa.info.webId!);
  console.log(bb);
}

/**
 * Generates a UUID (v4) string.
 * @returns The generated UUID string.
 */
export function generate_uuidv4() {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function( c ) {
     let rnd = Math.random() * 16; // Random number in the range 0 to 16
     rnd = (dt + rnd) % 16 | 0;
     dt = Math.floor(dt / 16);
     return (c === 'x' ? rnd : (rnd & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Calculates the Levenshtein distance between two strings.
 * @param s - The first string.
 * @param t - The second string.
 * @returns The Levenshtein distance between the two strings.
 */
export function levenshteinDistance(s: string, t: string) {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr: number[][] = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
}

export function getClassId(classUri: string): string | undefined {
  const paramString = classUri.split('?')[1];
  const urlParams = new URLSearchParams(paramString);
  const classId = urlParams.get('classId');
  return classId || undefined;
}
