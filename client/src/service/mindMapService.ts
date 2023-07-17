import {
  createSolidDataset,
  saveSolidDatasetAt
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";
import { Link } from "../models/types/Link";
import { LinkType } from "../models/enums/LinkType";
import { MindMap } from "../models/types/MindMap";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { UserSession } from "../models/UserSession";
import { LinkRepository } from "../repository/linkRepository";
import { MindMapRepository } from "../repository/mindMapRepository";
import { initializeAcl } from "./accessService";
import { MINDMAPS, TTLFILETYPE, WIKIMIND } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { ConnectionRepository } from "../repository/connectionRepository";
import { NodeRepository } from "../repository/nodeRepository";

export class MindMapService {
  private mindMapRepository: MindMapRepository;
  private linkRepository: LinkRepository;
  private connectionRepository: ConnectionRepository;
  private nodeRepository: NodeRepository;

  constructor() {
    this.mindMapRepository = new MindMapRepository();
    this.linkRepository = new LinkRepository();
    this.connectionRepository = new ConnectionRepository();
    this.nodeRepository = new NodeRepository();
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
        const nodes: any = await this.nodeRepository.getNodes(mindMap.storage)
        const connections: any = await this.connectionRepository.getConnections(mindMap.storage)
        const mindMapDataset: MindMapDataset = {
          mindMap: mindMap,
          links: connections,
          nodes: nodes,
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
    try {
      await this.mindMapRepository.removeMindMap(mindMap.mindMap.storage)
      let mindMapStorageDataset = createSolidDataset();
      await saveSolidDatasetAt(mindMap.mindMap.storage, mindMapStorageDataset, { fetch });
      this.connectionRepository.saveConnections(mindMap.mindMap.storage, mindMap.links)
      this.nodeRepository.saveNodes(mindMap.mindMap.storage, mindMap.nodes)
    } catch(error: any) {}
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
