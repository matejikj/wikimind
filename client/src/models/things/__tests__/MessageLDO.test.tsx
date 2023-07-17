import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
  setInteger,
  getInteger
} from "@inrupt/solid-client";
import { MessageLDO } from "../MessageLDO";
import { Message } from "../../types/Message";
import messageDefinition from "../../../definitions/message.json"

describe("MessageLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const messageLDO = new MessageLDO(messageDefinition);

  test("should read a Message object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with message data
    const messageLDOData: any = {
      id: "message123",
      from: "sender@example.com",
      text: "Hello, this is a test message!",
      date: 20230717,
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: messageLDOData.id }))
      .addStringNoLocale(messageDefinition.properties.id, messageLDOData.id)
      .addStringNoLocale(messageDefinition.properties.from, messageLDOData.from)
      .addStringNoLocale(messageDefinition.properties.text, messageLDOData.text)
      .addInteger(messageDefinition.properties.date, messageLDOData.date)
      .build();

    // Call the read method to convert the LDO to a Message object
    const message: Message = messageLDO.read(ldoThing);

    // Check if the Message object matches the input data
    expect(message).toEqual(messageLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Message object", () => {
    // Prepare the Message object
    const message: Message = {
      id: "message456",
      from: "sender@example.com",
      text: "This is another test message!",
      date: 20230718,
    };

    console.log("FADSfasd")
    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = messageLDO.create(message);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}message456`);
    expect(getStringNoLocale(ldoThing, messageDefinition.properties.id)).toBe(message.id);
    expect(getStringNoLocale(ldoThing, messageDefinition.properties.from)).toBe(message.from);
    expect(getStringNoLocale(ldoThing, messageDefinition.properties.text)).toBe(message.text);
    expect(getInteger(ldoThing, messageDefinition.properties.date)).toBe(message.date);
  });
});