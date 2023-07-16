import { buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";
import { rdf_type } from "../../LDO";
import { Message } from "../../types/Message";
import { MessageLDO } from "../MessageLDO";


/**
 * Tests for the MessageLDO class.
 */
describe("MessageLDO", () => {
  let messageLDO: MessageLDO;

  beforeEach(() => {
    // Create a new instance of MessageLDO with specified identity and properties.
    messageLDO = new MessageLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Message",
      "properties": {
        "to": "https://schema.org/recipient",
        "from": "https://schema.org/sender",
        "id": "http://schema.org/identifier",
        "text": "https://schema.org/text",
        "date": "https://schema.org/dateCreated"
      }
    });
  });

  test("read should return Message object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "message123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Message")
      .addStringNoLocale("https://schema.org/recipient", "John Doe")
      .addStringNoLocale("https://schema.org/sender", "Jane Smith")
      .addStringNoLocale("http://schema.org/identifier", "message123")
      .addStringNoLocale("https://schema.org/text", "Hello, how are you?")
      .addStringNoLocale("https://schema.org/dateCreated", "2023-07-04")
      .build();
    const result = messageLDO.read(mockThing);

    // Assert the returned Message object has expected values.
    expect(result).toEqual({
      id: "message123",
      from: "Jane Smith",
      to: "John Doe",
      text: "Hello, how are you?",
      date: "2023-07-04"
    });
  });

  test("create should return ThingLocal representing Message object", () => {
    const mockMessage: Message = {
      id: "message123",
      from: "Jane Smith",
      to: "John Doe",
      text: "Hello, how are you?",
      date: "2023-07-04"
    };

    const result = messageLDO.create(mockMessage);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("message123");
    expect(getStringNoLocale(result, "https://schema.org/dateCreated")).toBe("2023-07-04");
    expect(getStringNoLocale(result, "https://schema.org/text")).toBe("Hello, how are you?");
    expect(getStringNoLocale(result, "https://schema.org/sender")).toBe("Jane Smith");
    expect(getStringNoLocale(result, "https://schema.org/recipient")).toBe("John Doe");
  });
});
