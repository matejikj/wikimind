import {
  ThingLocal,
  buildThing,
  createThing,
  getInteger,
  getStringNoLocale
} from "@inrupt/solid-client";
import messageDefinition from "../../definitions/message.json";
import { MessageLDO } from "../../models/things/MessageLDO";
import { Message } from "../../models/types/Message";

describe("MessageLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const messageLDO = new MessageLDO(messageDefinition);

  test("should read a Message object from a Linked Data Object", () => {
    const messageLDOData: any = {
      id: "message123",
      from: "sender@example.com",
      text: "Hello, this is a test message!",
      date: 20230717,
    };

    const ldoThing: ThingLocal = buildThing(createThing({ name: messageLDOData.id }))
      .addStringNoLocale(messageDefinition.properties.id, messageLDOData.id)
      .addStringNoLocale(messageDefinition.properties.from, messageLDOData.from)
      .addStringNoLocale(messageDefinition.properties.text, messageLDOData.text)
      .addInteger(messageDefinition.properties.date, messageLDOData.date)
      .build();
    const message: Message = messageLDO.read(ldoThing);
    expect(message).toEqual(messageLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Message object", () => {
    const message: Message = {
      id: "message456",
      from: "sender@example.com",
      text: "This is another test message!",
      date: 20230718,
    };
    const ldoThing: ThingLocal = messageLDO.create(message);
    expect(ldoThing.url).toBe(`${rdfIdentity}message456`);
    expect(getStringNoLocale(ldoThing, messageDefinition.properties.id)).toBe(message.id);
    expect(getStringNoLocale(ldoThing, messageDefinition.properties.from)).toBe(message.from);
    expect(getStringNoLocale(ldoThing, messageDefinition.properties.text)).toBe(message.text);
    expect(getInteger(ldoThing, messageDefinition.properties.date)).toBe(message.date);
  });
});