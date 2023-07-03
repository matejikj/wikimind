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
import nodeDefinition from "../definitions/node.json";
import connectionDefinition from "../definitions/connection.json";
import mindMapDefinition from "../definitions/mindMap.json";
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

/**
 * Retrieves a mind map dataset from the given URL.
 * @param url The URL of the mind map dataset.
 * @returns The retrieved mind map dataset, or null if not found.
 */
export async function getMindMap(url: string): Promise<MindMapDataset | null> {
  const readingListUrl: string = url;
  const myDataset = await getSolidDataset(readingListUrl, { fetch: fetch });

  const things = await getThingAll(myDataset);

  const minMapBuilder = new MindMapLDO(mindMapDefinition);
  let mindMap: MindMap | null = null;
  const nodes: Node[] = [];
  const nodeBuilder = new NodeLDO(nodeDefinition);
  const links: Connection[] = [];
  const linkBuilder = new ConnectionLDO(connectionDefinition);

  things.forEach((thing) => {
    const types = getUrlAll(thing, RDF.type);
    if (types.some((type) => type === mindMapDefinition.identity)) {
      mindMap = minMapBuilder.read(thing);
    }
    if (types.some((type) => type === nodeDefinition.identity)) {
      nodes.push(nodeBuilder.read(thing));
    }
    if (types.some((type) => type === connectionDefinition.identity)) {
      links.push(linkBuilder.read(thing));
    }
  });

  if (mindMap !== null) {
    mindMap = mindMap as MindMap;
    const mindMapDataset: MindMapDataset = {
      id: mindMap.id,
      created: mindMap.created,
      links: links,
      nodes: nodes,
    };
    return mindMapDataset;
  } else {
    return null;
  }
}

/**
 * Creates a new mind map with the given name and user session.
 * @param name The name of the new mind map.
 * @param userSession The user session.
 * @returns The URL of the newly created mind map.
 */
export async function createNewMindMap(name: string, userSession: UserSession): Promise<string> {
  let courseSolidDataset = createSolidDataset();
  const blankMindMap: MindMap = {
    id: name,
    created: "",
  };
  const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap);
  courseSolidDataset = setThing(courseSolidDataset, mindMapLDO);
  const newName = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + name + TTLFILETYPE;
  const savedSolidDataset = await saveSolidDatasetAt(newName, courseSolidDataset, { fetch: fetch });

  if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
    initializeAcl(newName);
  }

  return newName;
}

/**
 * Creates a new mind map with the given name and user session.
 * @param name The name of the new mind map.
 * @param userSession The user session.
 * @returns The URL of the newly created mind map.
 */
export async function saveMindMap(mindMap: MindMapDataset, userSession: UserSession): Promise<string> {
  let mindMapDataset = createSolidDataset();

  const blankMindMap: MindMap = {
    id: mindMap.id,
    created: mindMap.created,
  };
  const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap);
  mindMapDataset = setThing(mindMapDataset, mindMapLDO);

  const nodeBuilder = new NodeLDO(nodeDefinition as LDO<Node>);

  mindMap.nodes.forEach(node => {
    mindMapDataset = setThing(mindMapDataset, nodeBuilder.create(node));
  });

  const connectionBuilder = new ConnectionLDO(connectionDefinition as LDO<Connection>);

  mindMap.links.forEach(connection => {
    mindMapDataset = setThing(mindMapDataset, connectionBuilder.create(connection));
  });

  const newName = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + mindMap.id + TTLFILETYPE;
  const savedSolidDataset = await saveSolidDatasetAt(newName, mindMapDataset, { fetch: fetch });

  return newName;
}

/**
 * Updates the given node in the mind map with the specified name and user session.
 * @param name The name of the mind map.
 * @param userSession The user session.
 * @param node The updated node.
 */
export async function updateNode(name: string | undefined, userSession: UserSession, node: Node): Promise<void> {
  if (name) {
    const podUrl = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + name + TTLFILETYPE;
    let courseSolidDataset = await getSolidDataset(podUrl, { fetch: fetch });

    const nodeBuilder = new NodeLDO(nodeDefinition as LDO<Node>);
    const thingUrl = podUrl + "#" + node.id;
    courseSolidDataset = setThing(courseSolidDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(podUrl, courseSolidDataset, { fetch: fetch });
  }
}

/**
 * Creates a new node in the mind map with the specified name and user session.
 * @param name The name of the mind map.
 * @param userSession The user session.
 * @param node The new node to be created.
 */
export async function createNode(name: string | undefined, userSession: UserSession, node: Node): Promise<void> {
  if (name) {
    const mindMapPath = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + name + TTLFILETYPE;
    let mindMapDataset = await getSolidDataset(mindMapPath, { fetch: fetch });

    const nodeBuilder = new NodeLDO(nodeDefinition as LDO<Node>);
    mindMapDataset = setThing(mindMapDataset, nodeBuilder.create(node));

    const savedSolidDataset = await saveSolidDatasetAt(mindMapPath, mindMapDataset, { fetch: fetch });
  }
}

/**
 * Adds a new link to the mind map with the specified name and user session.
 * @param name The name of the mind map.
 * @param userSession The user session.
 * @param link The new connection link to be added.
 */
export async function createConnection(name: string | undefined, userSession: UserSession, link: Connection): Promise<void> {
  if (name) {
    const mindMapPath = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + name + TTLFILETYPE;
    let mindMapDataset = await getSolidDataset(mindMapPath, { fetch: fetch });

    const linkBuilder = new ConnectionLDO(connectionDefinition as LDO<Connection>);
    mindMapDataset = setThing(mindMapDataset, linkBuilder.create(link));

    const savedSolidDataset = await saveSolidDatasetAt(mindMapPath, mindMapDataset, { fetch: fetch });
  }
}
