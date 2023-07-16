import { buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";
import { rdf_type } from "../../LDO";
import { Link } from "../../types/Link";
import { LinkType } from "../../types/LinkType";
import { LinkLDO } from "../LinkLDO";


/**
 * Tests for the LinkLDO class.
 */
describe("LinkLDO", () => {
  let linkLDO: LinkLDO;

  beforeEach(() => {
    // Create a new instance of LinkLDO with specified identity and properties.
    linkLDO = new LinkLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Link",
      "properties": {
        "url": "https://schema.org/url",
        "id": "http://schema.org/identifier",
        "linkType": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#LinkType"
      }
    });
  });

  test("read should return Link object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "link123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Link")
      .addStringNoLocale("https://schema.org/url", "https://example.com")
      .addStringNoLocale("http://schema.org/identifier", "link123")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#LinkType", "CHAT")
      .build();

    const result = linkLDO.read(mockThing);

    // Assert the returned Link object has expected values.
    expect(result).toEqual({
      url: "https://example.com",
      id: "link123",
      linkType: LinkType.CHAT_LINK
    });
  });

  test("create should return ThingLocal representing Link object", () => {
    const mockLink: Link = {
      url: "https://example.com",
      id: "link123",
      linkType: LinkType.CHAT_LINK
    };

    const result = linkLDO.create(mockLink);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("link123");
    expect(getStringNoLocale(result, "https://schema.org/url")).toBe("https://example.com");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#LinkType")).toBe("CHAT");
  });
});
