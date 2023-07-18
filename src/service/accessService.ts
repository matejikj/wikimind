import {
  acp_ess_2,
  createAclFromFallbackAcl,
  getResourceAcl,
  getSolidDatasetWithAcl,
  hasAccessibleAcl,
  hasFallbackAcl,
  hasResourceAcl,
  saveAclFor,
  getPodUrlAll,
  getResourceInfo
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";
import { string } from "rdf-namespaces/dist/fhir";

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
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    throw new Error(`Error when fetching dataset, url: ${url} error: ${message}`);
  }
  let resourceAcl;
  if (!hasResourceAcl(myDatasetWithAcl)) {
    if (!hasAccessibleAcl(myDatasetWithAcl)) {
      throw new Error(`The current user does not have permission to change access rights to this resource, url: ${url}`);
    }
    if (!hasFallbackAcl(myDatasetWithAcl)) {
      throw new Error(`The current user does not have permission to see who currently has access to this resource, url: ${url}`);
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

export async function getPodUrl(webId: string) {
  let podUrl
  const podUrls = (await getPodUrlAll(webId))
  if (podUrls && podUrls.length > 0) {
    podUrl = podUrls[0];
  } else {
    const resInfo = await getResourceInfo(webId)
    podUrl = resInfo.internal_resourceInfo.linkedResources[STORAGE_DESCRIPTION][0].split(WELL_KNOWN)[0]
  }
  return podUrl
}