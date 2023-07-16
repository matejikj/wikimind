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
import { MindMapRepository } from "../repository/mindMapRepository";
import { LinkRepository } from "../repository/linkRepository";

export class MindMapService {
  private mindMapRepository: MindMapRepository;
  private linkRepository: LinkRepository;

  constructor() {
    this.mindMapRepository = new MindMapRepository();
    this.linkRepository = new LinkRepository();
  }

  async getMindMapList(podUrl: string): Promise<MindMap[] | undefined> {
    try {
      const resMindMapList: MindMap[] = []
      const mindMapLinksUrl = `${podUrl}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;
      const mindMapLinks = await this.linkRepository.getLinksList(mindMapLinksUrl);
      await Promise.all(mindMapLinks.map(async (link) => {
        const mindMap = await this.mindMapRepository.getMindMap(link.url)
        mindMap && resMindMapList.push(mindMap)
      }));
      return resMindMapList
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getMindMap(mindMapUrl: string): Promise<MindMapDataset | undefined> {
    try {
      const mindMap = await this.mindMapRepository.getMindMap(mindMapUrl)
      if (mindMap) {
        const res: any = await this.mindMapRepository.getNodesAndConnections(mindMap.storage)
        const mindMapDataset: MindMapDataset = {
          mindMap: mindMap,
          links: res.links,
          nodes: res.nodes,
        };
        return mindMapDataset;
      }
    }

    catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async createNewMindMap(name: string, userSession: UserSession): Promise<string | undefined> {
    const mindMapsListUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;
    const mindMapStorageUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${generate_uuidv4()}${TTLFILETYPE}`;

    const blankMindMap: MindMap = {
      id: generate_uuidv4(),
      name: name,
      source: userSession.podUrl,
      storage: mindMapStorageUrl,
      created: Date.now().toString(),
    };
    const mindMapUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${blankMindMap.id}${TTLFILETYPE}`;
    const datasetLink: Link = {
      id: generate_uuidv4(),
      url: mindMapUrl,
      linkType: LinkType.GRAPH_LINK
    };
    this.linkRepository.createLink(mindMapsListUrl, datasetLink)
    this.mindMapRepository.createMindMap(mindMapUrl, blankMindMap)
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
  async saveMindMap(mindMap: MindMapDataset): Promise<void> {
    this.mindMapRepository.saveNodesAndConnections(mindMap.mindMap.storage, mindMap.nodes, mindMap.links)
  }

  async removeMindMap(mindMap: MindMap): Promise<boolean> {
    try {

      const mindMapLinksUrl = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;
      const mindMapLinks = await this.linkRepository.getLinksList(mindMapLinksUrl);

      await this.mindMapRepository.removeMindMap(mindMap.storage)
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
      await this.mindMapRepository.removeMindMap(url)

      const link = mindMapLinks.find((item) => item.url === url)
      if (link) {
        await this.linkRepository.removeLink(mindMapLinksUrl, link)
      }
      return true;
    }
    catch (error) {
      return false;
    }
  }

  async updateMindMap(mindMap: MindMap): Promise<boolean> {
    try {
      await this.mindMapRepository.updateMindMap(mindMap)
      return true;
    }
    catch (error) {
      return false;
    }
  }
}
