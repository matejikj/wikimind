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
import linkDefinition from "../definitions/link.json";
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
import { generate_uuidv4 } from "./utils";
import { Link } from "../models/types/Link";
import { LinkType } from "../models/types/LinkType";
import { LinkLDO } from "../models/things/LinkLDO";

export async function getMindMApsList(userSession: UserSession) {
  const mindMaps: MindMap[] = []
  const classesListUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;

  const myDataset = await getSolidDataset(
      classesListUrl,
      { fetch: fetch }
  );
  const things = await getThingAll(myDataset);
  const datasetLinkBuilder = new LinkLDO(linkDefinition)
  await Promise.all(things.map(async (thing) => {
      const types = getUrlAll(thing, RDF.type);
      if (types.some(type => type === linkDefinition.identity)) {
          const link = datasetLinkBuilder.read(thing)
          if (link.linkType === LinkType.GRAPH_LINK) {
              const myDataset = await getSolidDataset(
                  link.url,
                  { fetch: fetch }
              );
              const things = await getThingAll(myDataset);
              const mindMapBuilder = new MindMapLDO(mindMapDefinition)
              things.forEach(thing => {
                  const types = getUrlAll(thing, RDF.type);
                  if (types.some(type => type === mindMapDefinition.identity)) {
                      mindMaps.push(mindMapBuilder.read(thing))
                  }
              });
          }
      }
  }));
  return mindMaps;
}


export async function getMindMap(url: string): Promise<MindMapDataset | null> {
  const mindmapDataset = await getSolidDataset(url, { fetch });
  const mindMapThings = await getThingAll(mindmapDataset);

  const mindMapLDO = new MindMapLDO(mindMapDefinition);
  let mindMap: MindMap | null = null;

  mindMapThings.forEach((thing) => {
    const types = getUrlAll(thing, RDF.type);
    if (types.includes(mindMapDefinition.identity)) {
      mindMap = mindMapLDO.read(thing);
    }
  });

  if (mindMap !== null) {
    mindMap = mindMap as MindMap;
    const mindmapStorageDataset = await getSolidDataset(mindMap.storage, { fetch });
    const mindMapStorageThings = await getThingAll(mindmapStorageDataset);
    const nodes: Node[] = [];
    const nodeLDO = new NodeLDO(nodeDefinition);
    const links: Connection[] = [];
    const connectionLDO = new ConnectionLDO(connectionDefinition);
  
    mindMapStorageThings.forEach((thing) => {
      const types = getUrlAll(thing, RDF.type);
      if (types.includes(nodeDefinition.identity)) {
        nodes.push(nodeLDO.read(thing));
      }
      if (types.includes(connectionDefinition.identity)) {
        links.push(connectionLDO.read(thing));
      }
    });
    const mindMapDataset: MindMapDataset = {
      id: mindMap.id,
      name: mindMap.name,
      storage: mindMap.storage,
      created: mindMap.created,
      links: links,
      nodes: nodes,
    };
    return mindMapDataset;
  } else {
    return null
  }
}

export async function createNewMindMap(name: string, userSession: UserSession): Promise<string> {

  const mindMapsListUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;
  let mindMapListDataset = await getSolidDataset(mindMapsListUrl, { fetch });

  const mindMapStorageUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${generate_uuidv4()}${TTLFILETYPE} `;

  const blankMindMap: MindMap = {
    id: generate_uuidv4(),
    name: name,
    storage: mindMapStorageUrl,
    created: Date.now().toString(),
  };

  const mindMapUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${blankMindMap.id}${TTLFILETYPE} `;

  const datasetLink: Link = {
    id: generate_uuidv4(),
    url: mindMapUrl,
    linkType: LinkType.GRAPH_LINK
  };
  
  const linkLDO = new LinkLDO(linkDefinition).create(datasetLink);
  mindMapListDataset = setThing(mindMapListDataset, linkLDO);
  await saveSolidDatasetAt(mindMapsListUrl, mindMapListDataset, { fetch });

  let mindMapDataset = createSolidDataset();
  const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap);
  mindMapDataset = setThing(mindMapDataset, mindMapLDO);
  await saveSolidDatasetAt(mindMapUrl, mindMapDataset, { fetch });

  let mindMapStorage = createSolidDataset();
  await saveSolidDatasetAt(mindMapStorageUrl, mindMapStorage, { fetch });

  if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
    initializeAcl(mindMapUrl);
    initializeAcl(mindMapStorageUrl);
  }

  return mindMapUrl;
}


/**
 * Creates a new mind map with the given name and user session.
 * @param name The name of the new mind map.
 * @param userSession The user session.
 * @returns The URL of the newly created mind map.
 */
export async function saveMindMap(mindMap: MindMapDataset, userSession: UserSession): Promise<string> {
  let mindMapDataset = createSolidDataset();

  // const blankMindMap: MindMap = {
  //   id: mindMap.id,
  //   id: mindMap.id,
  //   created: mindMap.created,
  // };
  // const mindMapLDO = new MindMapLDO(mindMapDefinition).create(blankMindMap);
  // mindMapDataset = setThing(mindMapDataset, mindMapLDO);

  // const nodeBuilder = new NodeLDO(nodeDefinition as LDO<Node>);

  // mindMap.nodes.forEach(node => {
  //   mindMapDataset = setThing(mindMapDataset, nodeBuilder.create(node));
  // });

  // const connectionBuilder = new ConnectionLDO(connectionDefinition as LDO<Connection>);

  // mindMap.links.forEach(connection => {
  //   mindMapDataset = setThing(mindMapDataset, connectionBuilder.create(connection));
  // });

  // const newName = userSession.podUrl + WIKIMIND + SLASH + MINDMAPS + SLASH + mindMap.id + TTLFILETYPE;
  // const savedSolidDataset = await saveSolidDatasetAt(newName, mindMapDataset, { fetch: fetch });

  // return newName;
  return "newName";
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
