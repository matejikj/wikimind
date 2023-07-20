import {
  createSolidDataset,
  getSolidDataset,
  getThingAll,
  removeThing,
  saveSolidDatasetAt
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { UserSession } from "../models/UserSession";
import {
  AccessControlPolicy
} from "../models/enums/AccessControlPolicy";
import { LinkType } from "../models/enums/LinkType";
import { Link } from "../models/types/Link";
import { MindMap } from "../models/types/MindMap";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { ConnectionRepository } from "../repository/connectionRepository";
import { LinkRepository } from "../repository/linkRepository";
import { MindMapRepository } from "../repository/mindMapRepository";
import { NodeRepository } from "../repository/nodeRepository";
import { initializeAcl } from "./accessService";
import { MINDMAPS, TTLFILETYPE, WIKIMIND } from "./containerService";
import { generate_uuidv4 } from "./utils";

/**
 * MindMapService class provides methods for interacting with mind maps and related data.
 */
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

  /**
   * Retrieves the list of mind maps associated with a Pod.
   * @param podUrl - The URL of the Pod.
   * @returns A Promise that resolves to an array of MindMap objects.
   */
  async getMindMapList(podUrl: string): Promise<MindMap[]> {
    const resMindMapList: MindMap[] = []

    try {
      const mindMapLinksUrl = `${podUrl}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;
      const mindMapLinks = await this.linkRepository.getLinksList(mindMapLinksUrl);
      await Promise.all(mindMapLinks.map(async (link) => {
        try {
          const mindMap = await this.mindMapRepository.getMindMap(link.url)
          mindMap && resMindMapList.push(mindMap)
        } catch (error) {
          console.debug('Problem when getting mindMap: ', error)
        }
      }));
      return resMindMapList
    } finally {
      return resMindMapList;
    }
  }

  /**
   * Retrieves the details of a specific mind map and its associated nodes and connections.
   * @param mindMapUrl - The URL of the mind map.
   * @returns A Promise that resolves to the MindMapDataset object if found, otherwise undefined.
   */
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

  /**
   * Creates a new mind map with the given name and user session.
   * @param name - The name of the new mind map.
   * @param userSession - The user session.
   * @returns A Promise that resolves to the URL of the newly created mind map.
   */
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
  async saveMindMap(mindMap: MindMapDataset, userSession: UserSession): Promise<void> {
    try {

      let dataset = await getSolidDataset(mindMap.mindMap.storage, { fetch });

      const things = await getThingAll(dataset);
      things.forEach((thing) => {
        dataset = removeThing(dataset, thing)
      });
      await saveSolidDatasetAt(mindMap.mindMap.storage, dataset, { fetch });

      if (mindMap.links.length > 0) {
        this.connectionRepository.saveConnections(mindMap.mindMap.storage, mindMap.links)
      }

      if (mindMap.nodes.length > 0) {

        this.nodeRepository.saveNodes(mindMap.mindMap.storage, mindMap.nodes)
      }
    } catch (error: any) { }
  }

  /**
   * Removes a mind map and its associated data.
   * @param mindMap - The MindMap object representing the mind map to be removed.
   * @returns A Promise that resolves to true if the removal is successful, otherwise false.
   */
  async removeMindMap(mindMap: MindMap): Promise<boolean> {
    try {

      const mindMapLinksUrl = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${MINDMAPS}${TTLFILETYPE}`;
      const mindMapLinks = await this.linkRepository.getLinksList(mindMapLinksUrl);

      await this.mindMapRepository.removeMindMapDataset(mindMap.storage)
      const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
      await this.mindMapRepository.removeMindMapDataset(url)

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

  /**
   * Updates an existing mind map with the provided data.
   * @param mindMap - The MindMap object representing the mind map to be updated.
   * @returns A Promise that resolves to true if the update is successful, otherwise false.
   */
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
