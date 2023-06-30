import { fetch } from "@inrupt/solid-client-authn-browser";

import {
  createSolidDataset,
  getSolidDataset,
  getThingAll,
  getUrlAll,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/connection.json"
import mindMapDefinition from "../definitions/mindMap.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Connection } from "../models/types/Connection";
import { ConnectionLDO } from "../models/things/ConnectionLDO";
import { MindMap } from "../models/types/MindMap";
import { MINDMAPS, SLASH, TTLFILETYPE, WIKIMIND, getPodUrl } from "./containerService";
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

  const minMapBuilder = new MindMapLDO(mindMapDefinition)
  let mindMap: MindMap | null = null;
  const nodes: Node[] = []
  const nodeBuilder = new NodeLDO(nodeDefinition)
  const links: Connection[] = []
  const linkBuilder = new ConnectionLDO(linkDefinition)

  things.forEach(thing => {
    const types = getUrlAll(thing, RDF.type);
    console.log(types)
    if (types.some(type => type === mindMapDefinition.identity)) {
      console.log(thing)
      mindMap = minMapBuilder.read(thing)
    }
    if (types.some(type => type === nodeDefinition.identity)) {
      nodes.push(nodeBuilder.read(thing))
    }
    if (types.some(type => type === linkDefinition.identity)) {
      links.push(linkBuilder.read(thing))
    }
  });
  if (mindMap !== null) {
    mindMap = mindMap as MindMap
    const mindMapDataset: MindMapDataset = {
      id: mindMap.id,
      created: mindMap.created,
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
  const blankMindMap: MindMap = {
    id: name,
    created: ""
  }
  const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap)
  courseSolidDataset = setThing(courseSolidDataset, mindMapLDO)
  const newName = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + name + TTLFILETYPE
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

  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0] + "Wikie/mindMaps/" + name + ".ttl"
    let courseSolidDataset = await getSolidDataset(
      podUrl,
      { fetch: fetch }
    );
    const nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))
    const thingUrl = podUrl + "#" + node.id
    courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(
      podUrl,
      courseSolidDataset,
      { fetch: fetch }
    );
  }
}


export async function createNode(name: string, userSession: UserSession, node: Node) {
  // const datasetPath = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + name + TTLFILETYPE
  const datasetPath = name
  let mindMapDataset = await getSolidDataset(
      datasetPath,
      { fetch: fetch }
    );

    const nodeBuilder = new NodeLDO((nodeDefinition as LDO<Node>))
    mindMapDataset = setThing(mindMapDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(
      datasetPath,
      mindMapDataset,
      { fetch: fetch }
    );

}


export async function addNewLink(name: string, sessionId: any, link: Connection) {
  const podUrls = await getPodUrl(sessionId)
  if (podUrls !== null) {
    const podUrl = podUrls[0] + "Wikie/mindMaps/" + name + ".ttl"
    let courseSolidDataset = await getSolidDataset(
      podUrl,
      { fetch: fetch }
    );


    const linkBuilder = new ConnectionLDO((linkDefinition as LDO<Connection>))
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
