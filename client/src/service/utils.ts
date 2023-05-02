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

export async function checkStructure() {
  const aa: Session = getDefaultSession()
  console.log(aa)
  const bb = await getPodUrlAll(aa.info.webId!)
  console.log(bb)
}

export function generate_uuidv4() {
    var dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function( c ) {
       var rnd = Math.random() * 16;//random number in range 0 to 16
       rnd = (dt + rnd)%16 | 0;
       dt = Math.floor(dt/16);
       return (c === 'x' ? rnd : (rnd & 0x3 | 0x8)).toString(16);
    });
 }