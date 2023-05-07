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
  getPodUrlAll,
  isContainer,
  getLinkedResourceUrlAll,
  saveSolidDatasetAt,
  getSourceUrl,
  getContentType,
  getResourceInfo,
  getContainedResourceUrlAll
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
import { generate_uuidv4 } from "./utils";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl, isUrlContainer } from "./containerService";

export async function createNode(node: Node, sessionId: any) {
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

  let dataset = await getSolidDataset("https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/mindMap3.ttl", { fetch: fetch })
  let book1Thing = getThing(dataset, "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/mindMap3.ttl#dsa");
  console.log(book1Thing)
  if (book1Thing !== null) {
    book1Thing = buildThing(book1Thing)
      .setStringNoLocale("http://schema.org/alternateName", "scfrggr")
      .build();
    dataset = setThing(dataset, book1Thing);

  }

  let newName = "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/" + "mindMap3" + ".ttl"


  const savedSolidDataset = await saveSolidDatasetAt(
    newName,
    dataset,
    { fetch: fetch }
  );

  dataset = await getSolidDataset("https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/mindMap3.ttl", { fetch: fetch })
  book1Thing = getThing(dataset, "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/mindMap3.ttl#dsa");
  console.log(book1Thing)



}


export async function aaaa(node: Node, podUrl: string) {

  await handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://login.inrupt.com/",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  }

  





  // if (mindMap.nodes !== undefined) {

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


  // mam container a pokracuju a ukladam





  // console.log("FASDFASDFASD")
  // console.log("FASDFASDFASD")
  // console.log("FASDFASDFASD")
  // console.log(RDF.type)

  // let mindMap: MindMapDataset = {
  //   title: "fdas",
  //   acccessType: "all",
  //   url: "",
  //   created: "",
  //   id: "dsa",
  //   links: [],
  //   nodes: []
  // }

  // mindMap.nodes.push(node)

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

  // let newName = "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/" + generate_uuidv4() + ".ttl"

  // const savedSolidDataset = await saveSolidDatasetAt(
  //   newName,
  //   courseSolidDataset,
  //   { fetch: fetch }
  // );
}

