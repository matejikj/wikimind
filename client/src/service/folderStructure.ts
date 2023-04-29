import { login,logout, handleIncomingRedirect,Session, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
  addUrl,
  getThing,
  getSolidDataset,
  addStringNoLocale,
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
  createContainerAt,
  getStringNoLocale,
  saveSolidDatasetAt,
  getPodUrlAll
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";

const APP_DIR = "WIKIE"
const CLASS_DIR = "classes"
const GRAPH_DIR = "graphs"

export const checkStructure = async () => {
  const aa: Session = getDefaultSession()
  console.log(aa)
  const bb = await getPodUrlAll(aa.info.webId!)
  console.log(bb[0])
  return bb[0]
}

