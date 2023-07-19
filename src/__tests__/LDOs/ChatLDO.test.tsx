import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { ChatLDO } from "../../models/things/ChatLDO";
import { Chat } from "../../models/types/Chat";
import { AccessControlPolicy } from "../../models/enums/AccessControlPolicy";
import chatDefinition from "../../definitions/chat.json";

describe("ChatLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const chatLDO = new ChatLDO(chatDefinition);

  test("should read a Chat object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with chat data
    const chatLDOData: any = {
      id: "chat123",
      host: "https://example.com/chatHost",
      source: "https://example.com/chatSource",
      accessControlPolicy: "public", // Assuming AccessControlPolicy is a string enum with values like "public", "private", etc.
      storage: "https://example.com/chatStorage",
      modified: "2023-07-17T12:34:56Z",
      lastMessage: "Hello, this is the last message!",
      guest: "https://example.com/guestUser",
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: chatLDOData.id }))
      .addStringNoLocale(chatDefinition.properties.id, chatLDOData.id)
      .addStringNoLocale(chatDefinition.properties.host, chatLDOData.host)
      .addStringNoLocale(chatDefinition.properties.source, chatLDOData.source)
      .addStringNoLocale(chatDefinition.properties.accessControlPolicy, chatLDOData.accessControlPolicy)
      .addStringNoLocale(chatDefinition.properties.storage, chatLDOData.storage)
      .addStringNoLocale(chatDefinition.properties.modified, chatLDOData.modified)
      .addStringNoLocale(chatDefinition.properties.lastMessage, chatLDOData.lastMessage)
      .addStringNoLocale(chatDefinition.properties.guest, chatLDOData.guest)
      .build();

    // Call the read method to convert the LDO to a Chat object
    const chat: Chat = chatLDO.read(ldoThing);

    // Check if the Chat object matches the input data
    expect(chat).toEqual(chatLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Chat object", () => {
    // Prepare the Chat object
    const chat: Chat = {
      id: "chat456",
      host: "https://example.com/chatHost456",
      source: "https://example.com/chatSource456",
      accessControlPolicy: AccessControlPolicy.ACP, // Assuming AccessControlPolicy is an enum with values like Public, Private, etc.
      storage: "https://example.com/chatStorage456",
      modified: "2023-07-18T09:00:00Z",
      lastMessage: "This is the latest message!",
      guest: "https://example.com/guestUser456",
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = chatLDO.create(chat);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}chat456`);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.id)).toBe(chat.id);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.host)).toBe(chat.host);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.source)).toBe(chat.source);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.accessControlPolicy)).toBe(chat.accessControlPolicy);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.storage)).toBe(chat.storage);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.modified)).toBe(chat.modified);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.lastMessage)).toBe(chat.lastMessage);
    expect(getStringNoLocale(ldoThing, chatDefinition.properties.guest)).toBe(chat.guest);
  });
});
