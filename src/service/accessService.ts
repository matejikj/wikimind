import {
  acp_ess_2,
  createAclFromFallbackAcl,
  getPodUrlAll,
  getResourceAcl,
  getResourceInfo,
  getSolidDatasetWithAcl,
  hasAccessibleAcl,
  hasFallbackAcl,
  hasResourceAcl,
  saveAclFor
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";

export const STORAGE_DESCRIPTION = "http://www.w3.org/ns/solid/terms#storageDescription"
export const WELL_KNOWN = ".well-known"

/**
 * Initializes ACL for resources contained in a WAC POD.
 *
 * @category Access functions
 * @param {string} url - URL of the resource to initialize ACL for.
 * @returns {Promise<void>} - A Promise that resolves when the initialization is complete.
 */
export const initializeAcl = async (url: string): Promise<void> => {
  let myDatasetWithAcl;
  try {
    myDatasetWithAcl = await getSolidDatasetWithAcl(url, { fetch: fetch });
  } catch (error) {
    throw error
  }
  let resourceAcl;
  if (!hasResourceAcl(myDatasetWithAcl)) {
    if (!hasAccessibleAcl(myDatasetWithAcl)) {
      throw new Error(`No permissions`);
    }
    if (!hasFallbackAcl(myDatasetWithAcl)) {
      throw new Error(`No permissions`);
    }
    resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
  } else {
    resourceAcl = getResourceAcl(myDatasetWithAcl);
  }
  await saveAclFor(myDatasetWithAcl, resourceAcl, { fetch: fetch });
}

/**
 * Function that gets the POD's access mechanism.
 *
 * @category Access functions
 * @param {string} url - URL of the resource to get the agent's access for.
 * @returns {Promise<"wac" | "acp">} - A Promise that resolves with "wac" or "acp" representing the access mechanism.
 */
export const isWacOrAcp = async (url: string): Promise<AccessControlPolicy> => {
  let dataSetWithAcr;
  try {
    dataSetWithAcr = await acp_ess_2.getSolidDatasetWithAcr(url, { fetch: fetch });
  } catch (error) {
    return AccessControlPolicy.WAC;
  }
  if (!dataSetWithAcr.internal_acp.acr) return AccessControlPolicy.WAC;
  return AccessControlPolicy.ACP;
}

/**
 * Retrieves the Pod URL associated with the given WebID.
 * @param webId - The WebID of the user for whom the Pod URL is to be retrieved.
 * @returns A Promise that resolves to the user's Pod URL.
 */
export async function getPodUrl(webId: string): Promise<string> {
  let podUrl;
  
  // Attempt to get the Pod URL from the WebID profile's known podUrls.
  const podUrls = await getPodUrlAll(webId);
  if (podUrls && podUrls.length > 0) {
    podUrl = podUrls[0];
  } else {
    // If the Pod URL is not available in the WebID profile, retrieve it from the STORAGE_DESCRIPTION link.
    const resInfo = await getResourceInfo(webId);
    podUrl = resInfo.internal_resourceInfo.linkedResources[STORAGE_DESCRIPTION][0].split(WELL_KNOWN)[0];
  }
  
  return podUrl;
}
