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
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";

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
  let links: Link[] = []
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

export async function createNewMindMap(name: string, sessionId: string) {
  // if (!getDefaultSession().info.isLoggedIn) {
  //   await login({
  //     oidcIssuer: "https://login.inrupt.com/",
  //     redirectUrl: window.location.href,
  //     clientName: "My application"
  //   });
  // }

  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0]
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
    let newName = podUrl + "Wikie/mindMaps/" + name + ".ttl"

    const savedSolidDataset = await saveSolidDatasetAt(
      newName,
      courseSolidDataset,
      { fetch: fetch }
    );
    return newName
  }
}

export async function addNewNode(name: string, sessionId: string, node: Node) {
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
