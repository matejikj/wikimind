import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  getThing,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import classDefinition from "../../definitions/class.json";
import linkDefinition from "../../definitions/link.json";
import messageDefinition from "../../definitions/message.json";

import { ClassLDO } from "../../models/things/ClassLDO";
import { LinkLDO } from "../../models/things/LinkLDO";
import { AccessControlPolicy } from "../../models/enums/AccessControlPolicy";
import { Class } from "../../models/types/Class";
import { Link } from "../../models/types/Link";
import { LinkType } from "../../models/enums/LinkType";
import { Profile } from "../../models/types/Profile";
import { ClassService } from "../../service/classService";
import { generate_uuidv4 } from "../../service/utils";
import { MessageLDO } from "../../models/things/MessageLDO";
import { LanguageLocalization, UserSession } from "../../models/UserSession";
import { Message } from "../../models/types/Message";

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


let classesDataset = createSolidDataset();
let classDataset = createSolidDataset();
let storageDataset = createSolidDataset();

const classesDatasetUrl = "https://inrupt.com/.well-known/sdk-local-node/WikiMind/classes/classes.ttl";

const classId = generate_uuidv4();
const classDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/classes/${classId}.ttl`;

const storageId = generate_uuidv4();
const storageDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/classes/${classId}.ttl`;

describe("ClassService", () => {
  const podUrl = "https://inrupt.com/.well-known/sdk-local-node/";
  const profileMock: Profile = {
    webId: "https://matejikj.datapod.igrant.io/profile/card#me",
    name: "",
    surname: "",
    source: "",
  };

  beforeEach(async () => {
    (getSolidDataset as jest.Mock).mockImplementation(async (url, fetch) => {
      if (url === classesDatasetUrl) {
        return classesDataset;
      }
      if (url === classDatasetUrl) {
        return classDataset;
      }
      else {
        return storageDataset;
      }
    });

    (saveSolidDatasetAt as jest.Mock).mockImplementation(async (url, dataset, fetch) => {
      if (url === classesDatasetUrl) {
        classesDataset = dataset;
      }
      if (url === classDatasetUrl) {
        classDataset = dataset;
      }
      else {
        storageDataset = dataset;
      }
    });

    jest.clearAllMocks();
  });

  describe("getClass", () => {
    it("should fetch a class and its messages", async () => {
      const classLDO = new ClassLDO(classDefinition);
      const linkLDO = new LinkLDO(linkDefinition);
      const messageLDO = new MessageLDO(messageDefinition);

      // Prepare test class data
      const testClass: Class = {
        id: `WikiMind/classes/${classId}.ttl#${classId}`,
        name: "Class",
        teacher: "John",
        storage: storageDatasetUrl,
        source: "class-pod-1",
      };
      const classThing = classLDO.create(testClass);

      // Prepare test message data
      const message: Message = {
        id: "message456",
        from: "sender@example.com",
        text: "This is another test message!",
        date: 20230718,
      };
      const messageThing = messageLDO.create(message);

      const classesDataset = await getSolidDataset(classDatasetUrl, { fetch });
      const savedClassSolidDataset = setThing(classesDataset, classThing);
      await saveSolidDatasetAt(classDatasetUrl, savedClassSolidDataset, { fetch });

      // Save the message in the storage dataset
      const storageDataset = await getSolidDataset(storageDatasetUrl, { fetch });
      const savedMessageSolidDataset = setThing(storageDataset, messageThing);
      await saveSolidDatasetAt(storageDatasetUrl, savedMessageSolidDataset, { fetch });

      // Create the ClassService instance
      const classService = new ClassService();

      // Call the getClass method
      const classDataset = await classService.getClass(testClass.storage);

      const classExpectedDataset = {
        testResults: [
        ],
        messages: [
          {
            id: "message456",
            from: "sender@example.com",
            text: "This is another test message!",
            date: 20230718,
          },
        ],
        class: {
          name: "Class",
          id: `WikiMind/classes/${classId}.ttl#${classId}`,
          teacher: "John",
          source: "class-pod-1",
          storage: storageDatasetUrl,
        },
        students: [
        ],
        mindMaps: [
        ],
      }

      expect((classDataset)).toEqual((classExpectedDataset));
    })
  });

  describe("getClassList", () => {
    it("should fetch class list and return parsed classes", async () => {
      const classLDO = new ClassLDO(classDefinition);
      const linkLDO = new LinkLDO(linkDefinition);

      const test: Link = {
        id: generate_uuidv4(),
        url: classDatasetUrl,
        linkType: LinkType.CHAT_LINK,
      };
      const testthing = linkLDO.create(test);

      const classInstance: Class = {
        id: `WikiMind/classes/${classId}.ttl#${classId}`,
        name: "Class",
        teacher: "John",
        storage: storageDatasetUrl,
        source: "class-pod-1",
      };
      const classthing = classLDO.create(classInstance);

      const linksDataset = await getSolidDataset(classesDatasetUrl, { fetch });
      const savedLinkSolidDataset = setThing(linksDataset, testthing);
      await saveSolidDatasetAt(classesDatasetUrl, savedLinkSolidDataset, { fetch });

      const classesDataset = await getSolidDataset(classDatasetUrl, { fetch });
      const savedClassesSolidDataset = setThing(classesDataset, classthing);
      await saveSolidDatasetAt(classDatasetUrl, savedClassesSolidDataset, { fetch });

      const classService = new ClassService();
      const classList = await classService.getClassList(podUrl);

      expect(classList).toEqual([classInstance]);
    });
  });

  describe("createNewClass", () => {
    it("should create a new mind map and return its URL", async () => {

      // Prepare test data
      const className = "New Mind Map";
      const classId = generate_uuidv4();

      // Mock the user session
      const userSession: UserSession = {
        webId: "matejikj",
        podUrl: "https://inrupt.com/.well-known/sdk-local-message/",
        isLogged: true,
        localization: LanguageLocalization.CS,
        podAccessControlPolicy: AccessControlPolicy.ACP
      };

      // Create the ClassService instance
      const classService = new ClassService();

      // Call the createNewClass method
      const createdClassUrl = await classService.createNewClass(className, userSession);

      expect(createdClassUrl).not.toBeUndefined()
    });
  });

})
