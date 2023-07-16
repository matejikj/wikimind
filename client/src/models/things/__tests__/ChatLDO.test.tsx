import { rdf_type } from "../../LDO";
import { AccessControlPolicy } from "../../types/AccessControlPolicy";
import { Chat } from "../../types/Chat";
import { ChatLDO } from "../ChatLDO";
import { createThing, getStringNoLocale, buildThing, addStringNoLocale, addUrl } from "@inrupt/solid-client";


/**
 * Tests for the ChatLDO class.
 */
describe("ChatLDO", () => {
  let chatLDO: ChatLDO;

  beforeEach(() => {
    // Create a new instance of ChatLDO with specified identity and properties.
    chatLDO = new ChatLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Chat",
      "properties": {
        "id": "http://schema.org/identifier",
        "host": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#owner",
        "guest": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#guest",
        "storage": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#storage",
        "modified": "http://schema.org/modified",
        "source": "http://schema.org/source",
        "accessControlPolicy": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#ownerAccessType",
        "lastMessage": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#lastMessage"
      }
    });
  });

  test("read should return Chat object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "Wikie" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Chat")
      .addStringNoLocale("http://schema.org/identifier", "chat123")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#owner", "https://example.com/owner")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#guest", "https://example.com/guest")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#storage", "https://example.com/storage")
      .addStringNoLocale("http://schema.org/modified", "2023-07-04T12:00:00Z")
      .addStringNoLocale("http://schema.org/source", "matejikj")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#ownerAccessType", "WAC")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#lastMessage", "Hello, World!")
      .build();

    const result = chatLDO.read(mockThing);

    // Assert the returned Chat object has expected values.
    expect(result).toEqual({
      id: "chat123",
      host: "https://example.com/owner",
      guest: "https://example.com/guest",
      storage: "https://example.com/storage",
      source: "matejikj",
      ownerAccessType: "WAC",
      modified: "2023-07-04T12:00:00Z",
      lastMessage: "Hello, World!"
    });
  });

  test("create should return ThingLocal representing Chat object", () => {
    const mockChat: Chat = {
      id: "chat123",
      host: "https://example.com/owner",
      guest: "https://example.com/guest",
      source: "matejikj",
      accessControlPolicy: AccessControlPolicy.WAC,
      storage: "https://example.com/storage",
      modified: "2023-07-04T12:00:00Z",
      lastMessage: "Hello, World!"
    };

    const result = chatLDO.create(mockChat);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("chat123");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#owner")).toBe("https://example.com/owner");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#guest")).toBe("https://example.com/guest");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#storage")).toBe("https://example.com/storage");
    expect(getStringNoLocale(result, "http://schema.org/source")).toBe("matejikj");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#ownerAccessType")).toBe("WAC");
    expect(getStringNoLocale(result, "http://schema.org/modified")).toBe("2023-07-04T12:00:00Z");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#lastMessage")).toBe("Hello, World!");
  });
});
