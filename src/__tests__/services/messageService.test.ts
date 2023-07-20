import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  getThing,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import chatDefinition from "../../definitions/chat.json";
import linkDefinition from "../../definitions/link.json";
import messageDefinition from "../../definitions/message.json";

import { ChatLDO } from "../../models/things/ChatLDO";
import { LinkLDO } from "../../models/things/LinkLDO";
import { AccessControlPolicy } from "../../models/enums/AccessControlPolicy";
import { Chat } from "../../models/types/Chat";
import { Link } from "../../models/types/Link";
import { LinkType } from "../../models/enums/LinkType";
import { Profile } from "../../models/types/Profile";
import { MessageService } from "../../service/messageService";
import { generate_uuidv4 } from "../../service/utils";
import { Message } from "../../models/types/Message";
import { MessageLDO } from "../../models/things/MessageLDO";

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

let chatsDataset = createSolidDataset();
let chatDataset = createSolidDataset();
let storageDataset = createSolidDataset();

const chatsDatasetUrl = "https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/chats.ttl";

const chatId = generate_uuidv4();
const chatDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/${chatId}.ttl`;

const storageId = generate_uuidv4();
const storageDatasetUrl = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/${chatId}.ttl`;

describe("MessageService", () => {
  const podUrl = "https://inrupt.com/.well-known/sdk-local-node/";
  const profileMock: Profile = {
    webId: "https://matejikj.datapod.igrant.io/profile/card#me",
    name: "",
    surname: "",
    source: "",
  };

  beforeEach(async () => {
    (getSolidDataset as jest.Mock).mockImplementation(async (url, fetch) => {
      if (url === chatsDatasetUrl) {
        return chatsDataset;
      }
      if (url === chatDatasetUrl) {
        return chatDataset;
      }
      if (url === storageDatasetUrl) {
        return storageDataset;
      }
    });

    (saveSolidDatasetAt as jest.Mock).mockImplementation(async (url, dataset, fetch) => {
      if (url === chatsDatasetUrl) {
        chatsDataset = dataset;
      }
      if (url === chatDatasetUrl) {
        chatDataset = dataset;
      }
      if (url === storageDatasetUrl) {
        storageDataset = dataset;
      }
    });

    jest.clearAllMocks();
  });

  describe("getChat", () => {
    it("should fetch a chat and its messages", async () => {
      const chatLDO = new ChatLDO(chatDefinition);
      const messageLDO = new MessageLDO(messageDefinition);
      const chat: Chat = {
        id: `WikiMind/chats/${chatId}.ttl#${chatId}`,
        host: "John",
        guest: "Jane",
        storage: storageDatasetUrl,
        source: "chat-pod-1",
        accessControlPolicy: AccessControlPolicy.ACP,
        lastMessage: "Hello!",
        modified: "2023-07-15T10:30:00Z",
      };
      const chatThing = chatLDO.create(chat);
      const message: Message = {
        id: `WikiMind/chats/${generate_uuidv4()}.ttl#${generate_uuidv4()}`,
        from: profileMock.webId,
        text: "Hello, Jane!",
        date: Date.now(),
      };
      const messageThing = messageLDO.create(message);
      const chatsDataset = await getSolidDataset(chatDatasetUrl, { fetch });
      const savedChatSolidDataset = setThing(chatsDataset, chatThing);
      await saveSolidDatasetAt(chatDatasetUrl, savedChatSolidDataset, { fetch });
      const storageDataset = await getSolidDataset(storageDatasetUrl, { fetch });
      const savedMessageSolidDataset = setThing(storageDataset, messageThing);
      await saveSolidDatasetAt(storageDatasetUrl, savedMessageSolidDataset, { fetch });
      const messageService = new MessageService();
      const chatDataset = await messageService.getChat(chat.storage);
      if (chatDataset) {
        expect((chatDataset?.messages)).toEqual(([message]));
      }
    })
  });

  describe("getChatList", () => {
    it("should fetch chat list and return parsed chats", async () => {
      const chatLDO = new ChatLDO(chatDefinition);
      const linkLDO = new LinkLDO(linkDefinition);

      const test: Link = {
        id: generate_uuidv4(),
        url: chatDatasetUrl,
        linkType: LinkType.CHAT_LINK,
      };
      const testthing = linkLDO.create(test);

      const chat: Chat = {
        id: `WikiMind/chats/${chatId}.ttl#${chatId}`,
        host: "John",
        guest: "Jane",
        storage: "https://inrupt.com/.well-known/sdk-local-node/",
        source: "chat-pod-1",
        accessControlPolicy: AccessControlPolicy.ACP,
        lastMessage: "Hello!",
        modified: "2023-07-15T10:30:00Z",
      };
      const chatthing = chatLDO.create(chat);

      const linksDataset = await getSolidDataset(chatsDatasetUrl, { fetch });
      const savedLinkSolidDataset = setThing(linksDataset, testthing);
      await saveSolidDatasetAt(chatsDatasetUrl, savedLinkSolidDataset, { fetch });

      const chatsDataset = await getSolidDataset(chatDatasetUrl, { fetch });
      const savedChatsSolidDataset = setThing(chatsDataset, chatthing);
      await saveSolidDatasetAt(chatDatasetUrl, savedChatsSolidDataset, { fetch });

      const messageService = new MessageService();
      const chatList = await messageService.getChatList(podUrl);

      expect(chatList).toEqual([chat]);
    });
  });

  describe("sendMessage", () => {
    it("should send a message to a chat", async () => {
      const chatLDO = new ChatLDO(chatDefinition);
      const linkLDO = new LinkLDO(linkDefinition);
      const messageLDO = new MessageLDO(messageDefinition);

      const chat: Chat = {
        id: chatId,
        host: "John",
        guest: "Jane",
        storage: storageDatasetUrl,
        source: 'https://inrupt.com/.well-known/sdk-local-node/',
        accessControlPolicy: AccessControlPolicy.ACP,
        lastMessage: "Hello!",
        modified: "2023-07-15T10:30:00Z",
      };
      const chatThing = chatLDO.create(chat);

      const msgId = generate_uuidv4()
      const msgThingId = `https://inrupt.com/.well-known/sdk-local-node/WikiMind/chats/${msgId}.ttl#${msgId}`

      const message: Message = {
        id: `WikiMind/chats/${msgId}.ttl#${msgId}`,
        from: profileMock.webId,
        text: "Hello, Jane!",
        date: Date.now(),
      };

      const linksDataset = await getSolidDataset(chatsDatasetUrl, { fetch });
      const link: Link = {
        id: generate_uuidv4(),
        url: chatDatasetUrl,
        linkType: LinkType.CHAT_LINK,
      };
      const linkThing = linkLDO.create(link);
      const savedLinkSolidDataset = setThing(linksDataset, linkThing);
      await saveSolidDatasetAt(chatsDatasetUrl, savedLinkSolidDataset, { fetch });

      const chatsDataset = await getSolidDataset(chatDatasetUrl, { fetch });
      const savedChatSolidDataset = setThing(chatsDataset, chatThing);
      await saveSolidDatasetAt(chatDatasetUrl, savedChatSolidDataset, { fetch });
      const messageService = new MessageService();

      await messageService.sendMessage(chat, message);
      const updatedChatDataset = await getSolidDataset(storageDatasetUrl, { fetch });
      const resThing = await getThing(updatedChatDataset, msgThingId);
      const resMessage = messageLDO.read(resThing);
      expect((resMessage)).toEqual((message));
    });
  });
})
