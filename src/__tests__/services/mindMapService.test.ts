import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  getThing,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import mindMapDefinition from "../../definitions/mindMap.json";
import linkDefinition from "../../definitions/link.json";
import nodeDefinition from "../../definitions/node.json";

import { MindMapLDO } from "../../models/things/MindMapLDO";
import { LinkLDO } from "../../models/things/LinkLDO";
import { AccessControlPolicy } from "../../models/enums/AccessControlPolicy";
import { MindMap } from "../../models/types/MindMap";
import { Link } from "../../models/types/Link";
import { LinkType } from "../../models/enums/LinkType";
import { Profile } from "../../models/types/Profile";
import { MindMapService } from "../../service/mindMapService";
import { generate_uuidv4 } from "../../service/utils";
import { Node } from "../../models/types/Node";
import { NodeLDO } from "../../models/things/NodeLDO";
import { LanguageLocalization, UserSession } from "../../models/UserSession";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
  fetch: jest.fn(),
}));

jest.mock("@inrupt/solid-client", () => {
  const originalModule = jest.requireActual("@inrupt/solid-client");
  return {
    ...originalModule,
    getSolidDataset: jest.fn(),
    saveSolidDatasetAt: jest.fn(),
  };
});


let mindMapsDataset = createSolidDataset();
let mindMapDataset = createSolidDataset();
let storageDataset = createSolidDataset();

const mindMapsDatasetUrl = "https://inrupt.com/.well-known/sdk-local-node/WikiMind/mindMaps/mindMaps.ttl";

const mindMapId = generate_uuidv4();
const mindMapDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/mindMaps/${mindMapId}.ttl`;

const storageId = generate_uuidv4();
const storageDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/mindMaps/${mindMapId}.ttl`;

describe("MindMapService", () => {
  const podUrl = "https://inrupt.com/.well-known/sdk-local-node/";
  const profileMock: Profile = {
    webId: "https://matejikj.datapod.igrant.io/profile/card#me",
    name: "",
    surname: "",
    source: "",
  };

  beforeEach(async () => {
    (getSolidDataset as jest.Mock).mockImplementation(async (url, fetch) => {
      if (url === mindMapsDatasetUrl) {
        return mindMapsDataset;
      }
      if (url === mindMapDatasetUrl) {
        return mindMapDataset;
      }
      else {
        return storageDataset;
      }
    });

    (saveSolidDatasetAt as jest.Mock).mockImplementation(async (url, dataset, fetch) => {
      if (url === mindMapsDatasetUrl) {
        mindMapsDataset = dataset;
      }
      if (url === mindMapDatasetUrl) {
        mindMapDataset = dataset;
      }
      else {
        storageDataset = dataset;
      }
    });

    jest.clearAllMocks();
  });

  describe("getMindMap", () => {
    it("should fetch a mindMap and its nodes", async () => {
      const mindMapLDO = new MindMapLDO(mindMapDefinition);
      const linkLDO = new LinkLDO(linkDefinition);
      const nodeLDO = new NodeLDO(nodeDefinition);

      // Prepare test mindMap data
      const mindMap: MindMap = {
        id: `WikiMind/mindMaps/${mindMapId}.ttl#${mindMapId}`,
        name: "My Mind Map",
        storage: storageDatasetUrl,
        source: "https://example.com/mindMapSource",
        created: "2023-07-17T12:34:56Z",
      };
      const mindMapThing = mindMapLDO.create(mindMap);

      // Prepare test node data
      const node: Node = {
        id: `WikiMind/mindMaps/${generate_uuidv4()}.ttl#${generate_uuidv4()}`,
        cx: 100,
        cy: 200,
        title: "My Node",
        uri: "https://example.com/node123",
        description: "This is a test node.",
        textColor: "black",
        color: "white",
        isInTest: true,
      };
      const nodeThing = nodeLDO.create(node);

      const mindMapsDataset = await getSolidDataset(mindMapDatasetUrl, { fetch });
      const savedMindMapSolidDataset = setThing(mindMapsDataset, mindMapThing);
      await saveSolidDatasetAt(mindMapDatasetUrl, savedMindMapSolidDataset, { fetch });

      // Save the node in the storage dataset
      const storageDataset = await getSolidDataset(storageDatasetUrl, { fetch });
      const savedNodeSolidDataset = setThing(storageDataset, nodeThing);
      await saveSolidDatasetAt(storageDatasetUrl, savedNodeSolidDataset, { fetch });

      // Create the MindMapService instance
      const mindMapService = new MindMapService();

      // Call the getMindMap method
      const mindMapDataset = await mindMapService.getMindMap(mindMap.storage);
      if (mindMapDataset) {
        expect((mindMapDataset?.nodes)).toEqual(([node]));
      }
    })
  });

  describe("getMindMapList", () => {
    it("should fetch mindMap list and return parsed mindMaps", async () => {
      const mindMapLDO = new MindMapLDO(mindMapDefinition);
      const linkLDO = new LinkLDO(linkDefinition);

      const test: Link = {
        id: generate_uuidv4(),
        url: mindMapDatasetUrl,
        linkType: LinkType.CHAT_LINK,
      };
      const testthing = linkLDO.create(test);

      const mindMap: MindMap = {
        id: `WikiMind/mindMaps/${mindMapId}.ttl#${mindMapId}`,
        name: "My Mind Map",
        storage: "https://example.com/mindMap123",
        source: "https://example.com/mindMapSource",
        created: "2023-07-17T12:34:56Z",
      };
      const mindMapthing = mindMapLDO.create(mindMap);

      const linksDataset = await getSolidDataset(mindMapsDatasetUrl, { fetch });
      const savedLinkSolidDataset = setThing(linksDataset, testthing);
      await saveSolidDatasetAt(mindMapsDatasetUrl, savedLinkSolidDataset, { fetch });

      const mindMapsDataset = await getSolidDataset(mindMapDatasetUrl, { fetch });
      const savedMindMapsSolidDataset = setThing(mindMapsDataset, mindMapthing);
      await saveSolidDatasetAt(mindMapDatasetUrl, savedMindMapsSolidDataset, { fetch });

      const mindMapService = new MindMapService();
      const mindMapList = await mindMapService.getMindMapList(podUrl);

      expect(mindMapList).toEqual([mindMap]);
    });
  });

  describe("createNewMindMap", () => {
    it("should create a new mind map and return its URL", async () => {

      const mindMapLDO = new MindMapLDO(mindMapDefinition);
      const linkLDO = new LinkLDO(linkDefinition);

      // Prepare test data
      const mindMapName = "New Mind Map";
      const mindMapId = generate_uuidv4();
      const mindMapStorageUrl = `https://example.com/mindMaps/${mindMapId}.ttl`;
      const mindMapUrl = `https://example.com/mindMaps/${mindMapId}.ttl#MindMap`;

      // Mock the user session
      const userSession: UserSession = {
        webId: "matejikj",
        podUrl: "https://inrupt.com/.well-known/sdk-local-node/",
        isLogged: true,
        localization: LanguageLocalization.CS,
        podAccessControlPolicy: AccessControlPolicy.ACP 
      };

      // Create the MindMapService instance
      const mindMapService = new MindMapService();

      // Call the createNewMindMap method
      const createdMindMapUrl = await mindMapService.createNewMindMap(mindMapName, userSession);

      expect(createdMindMapUrl).not.toBeUndefined()

    });
  });

})
