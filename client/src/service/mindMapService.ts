import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
  addUrl,
  getThing,
  getSolidDataset,
  addStringNoLocale,
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
  setUrl,
  getThingAll,
  createContainerAt,
  getStringNoLocale,
  getUrlAll,
  getUrl,
  Thing,
  getLinkedResourceUrlAll,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";

export async function getMindMapList() {
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://login.inrupt.com/",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  } else {
    console.log('PRIHLASENO')
  }
  const readingListUrl: string = 'https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/'
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }          // fetch from authenticated session
  );
  const thing = getThing(myDataset, 'https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/');
  if (thing !== null) {
    return getUrlAll(thing, 'http://www.w3.org/ns/ldp#contains');
  }
  return []
}

export async function getMindMap(url: string) {
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://login.inrupt.com/",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  } else {
    console.log('PRIHLASENO')
  }

  const readingListUrl: string = url
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }          // fetch from authenticated session
  );
  console.log(myDataset)
  // const things = await getThing(myDataset, 'http://www.w3.org/ns/ldp#contains');
  const things = await getThingAll(myDataset);
  console.log(things)

  // const fdsa = getUrl(things[0], 'http://www.w3.org/ns/ldp#contains')
  // console.log(fdsa)

  let nodes: Node[] = []
  let nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))
  const filteredThings = things.filter(thing => {
    const types = getUrlAll(thing, RDF.type);
    // const types = getUrlAll(thing, 'http://www.w3.org/ns/ldp#contains');
    console.log(types)
    if (types.some(type => type === 'https://matejikj.inrupt.net/Wikie/vocabulary.ttl#Node')) {
      console.log("AAAAAAAAAAAA")

      nodes.push(nodeBuilder.read(thing))
    }
  });
}

export async function saveMindMap(mindMap: MindMap) {

  await handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://login.inrupt.com/",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  } else {
    console.log('PRIHLASENO')
  }

  const cont = createContainerAt('https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/' + 'Wikie', { fetch: fetch });
  console.log("FASDFASDFASD")
  console.log("FASDFASDFASD")
  console.log("FASDFASDFASD")
  console.log(RDF.type)

  let courseSolidDataset = createSolidDataset();

  // const bb: LDO<MindMap> = mindMapDefinition
  const mapBuilder = new MindMapLDO(mindMapDefinition)
  let cc = mapBuilder.create(mindMap)

  const savedSolidDataset = await saveSolidDatasetAt(
    "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/mindMap3.ttl",
    courseSolidDataset,
    { fetch: fetch }
  );
}

