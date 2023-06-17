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
import { Connection } from "../models/types/Connection";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { UserSession } from "../models/types/UserSession";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { initializeAcl } from "./accessService";

export async function getMindMap(url: string) {

  const readingListUrl: string = url
  const myDataset = await getSolidDataset(
    readingListUrl,
    { fetch: fetch }
  );

  const things = await getThingAll(myDataset);

  let minMapBuilder = new MindMapLDO(mindMapDefinition)
  let mindMap: MindMap | null = null;
  let nodes: Node[] = []
  let nodeBuilder = new NodeLDO(nodeDefinition)
  let links: Connection[] = []
  let linkBuilder = new LinkLDO(linkDefinition)

  things.forEach(thing => {
    const types = getUrlAll(thing, RDF.type);
    console.log(types)
    if (types.some(type => type === mindMapDefinition.identity.subject)) {
      console.log(thing)
      mindMap = minMapBuilder.read(thing)
    }
    if (types.some(type => type === nodeDefinition.identity.subject)) {
      nodes.push(nodeBuilder.read(thing))
    }
    if (types.some(type => type === linkDefinition.identity.subject)) {
      links.push(linkBuilder.read(thing))
    }
  });
  if (mindMap !== null) {
    mindMap = mindMap as MindMap
    const mindMapDataset: MindMapDataset = {
      id: mindMap.id,
      title: mindMap.title,
      acccessType: mindMap.acccessType,
      created: mindMap.created,
      url: mindMap.url,
      links: links,
      nodes: nodes
    }
    return mindMapDataset
  } else {
    return null
  }
}

export async function createNewMindMap(name: string, userSession: UserSession) {
    let courseSolidDataset = createSolidDataset();
    let blankMindMap: MindMap = {
      title: name,
      id: generate_uuidv4(),
      acccessType: "",
      url: "",
      created: ""
    }
    const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap)
    courseSolidDataset = setThing(courseSolidDataset, mindMapLDO)
    let newName = userSession.podUrl + "Wikie/mindMaps/" + name + ".ttl"
    const savedSolidDataset = await saveSolidDatasetAt(
      newName,
      courseSolidDataset,
      { fetch: fetch }
    );

    if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
      initializeAcl(newName)
    }

    return newName
  
}

export async function createPreparedMindMap(nodes: Node[], links: Connection[], name: string, userSession: UserSession) {
  let courseSolidDataset = createSolidDataset();
  let blankMindMap: MindMap = {
    title: name,
    id: generate_uuidv4(),
    acccessType: "",
    url: "",
    created: ""
  }
  const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap)
  courseSolidDataset = setThing(courseSolidDataset, mindMapLDO)
  let newName = userSession.podUrl + "Wikie/mindMaps/" + name + ".ttl"
  const savedSolidDataset = await saveSolidDatasetAt(
    newName,
    courseSolidDataset,
    { fetch: fetch }
  );

  if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
    initializeAcl(newName)
  }

  return newName

}

export async function updateNode(name: string, sessionId: string, node: Node) {
  console.log(name)
  //   if (!getDefaultSession().info.isLoggedIn) {
  //   await login({
  //     oidcIssuer: "https://login.inrupt.com/",
  //     redirectUrl: window.location.href,
  //     clientName: "My application"
  //   });
  // }
  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0] + "Wikie/mindMaps/" + name + ".ttl"
    let courseSolidDataset = await getSolidDataset(
      podUrl,
      { fetch: fetch }
    );
    let nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))
    let thingUrl = podUrl + "#" + node.id
    // // let thingUrl = "https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/ahojda.ttl#44274717-8e40-41d3-a372-94d85bd5e686"
    // console.log(thingUrl)
    //     let book1Thing = await getThing(courseSolidDataset, thingUrl);
    //     if (book1Thing !== null){
    //       console.log(nodeBuilder.read(book1Thing))
    //       console.log(getStringNoLocale(book1Thing, 'http://schema.org/identifier'))
    //     }
        courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));



    // console.log(nodeBuilder.read(book1Thing))

    // let book1Thing = getThing(courseSolidDataset, `${resourceURL}#${}`);
    // book1Thing = buildThing(book1Thing)
    //   .addInteger("https://schema.org/numberOfPages", 30)
    //   .build();

    // courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(
      podUrl,
      courseSolidDataset,
      { fetch: fetch }
    );

  }
}


export async function createNode(name: string, sessionId: string, node: Node) {
  console.log(name)
  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0] + "Wikie/mindMaps/" + name + ".ttl"
    let courseSolidDataset = await getSolidDataset(
      podUrl,
      { fetch: fetch }
    );


    let nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))
    courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(
      podUrl,
      courseSolidDataset,
      { fetch: fetch }
    );

  }
}

export async function addNewLink(name: string, sessionId: any, link: Connection) {
  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0] + "Wikie/mindMaps/" + name + ".ttl"
    let courseSolidDataset = await getSolidDataset(
      podUrl,
      { fetch: fetch }
    );


    let linkBuilder = new LinkLDO((linkDefinition as LDO<Connection>))
    courseSolidDataset = setThing(courseSolidDataset, linkBuilder.create(link));

    const savedSolidDataset = await saveSolidDatasetAt(
      podUrl,
      courseSolidDataset,
      { fetch: fetch }
    );

  }
  console.log(name)
  console.log(sessionId)
  console.log(link)
}
