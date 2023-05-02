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

export async function createNode(node: Node) {

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

  // const cont = createContainerAt('https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/' + 'Wikie/mindMaps', { fetch: fetch });
  console.log("FASDFASDFASD")
  console.log("FASDFASDFASD")
  console.log("FASDFASDFASD")
  console.log(RDF.type)

  // let courseSolidDataset = createSolidDataset();

  // // const bb: LDO<MindMap> = mindMapDefinition
  // const mapBuilder = new MindMapLDO(mindMapDefinition)
  // let cc = mapBuilder.create(mindMap)

  // if (mindMap.nodes !== undefined) {
  //   let nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))

  //   mindMap.nodes.forEach(node => {
  //     courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));
  //     const propertyName = 'https://www.w3.org/ns/ldp#contains';
  //     const propertyValue = 'http://schema.org/alternateName';
  //     cc = setUrl(cc, propertyName, propertyValue);
  //   })
  // }

  // if (mindMap.links !== undefined) {
  //   let linkBuilder = new LinkLDO((linkDefinition as LDO<Link>))

  //   mindMap.links.forEach(link => {
  //     courseSolidDataset = setThing(courseSolidDataset, linkBuilder.create(link));
  //     const propertyName = 'https://www.w3.org/ns/ldp#contains';
  //     const propertyValue = RDF.Bag;
  //     cc = setUrl(cc, propertyName, propertyValue);

  //   })
  // }
  // courseSolidDataset = setThing(courseSolidDataset, cc);

  // console.log(cc)

  // const savedSolidDataset = await saveSolidDatasetAt(
  //   "https://matejikj.inrupt.net/Wikie/mindMaps/mindMap3.ttl",
  //   courseSolidDataset,
  //   { fetch: fetch }
  // );
}

