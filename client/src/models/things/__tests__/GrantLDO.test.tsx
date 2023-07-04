import { rdf_type } from "../../LDO";
import { Grant } from "../../types/Grant";
import { GrantLDO } from "../GrantLDO";
import { createThing, getStringNoLocale, buildThing, addStringNoLocale, addUrl } from "@inrupt/solid-client";

/**
 * Tests for the GrantLDO class.
 */
describe("GrantLDO", () => {
  let grantLDO: GrantLDO;

  beforeEach(() => {
    // Create a new instance of GrantLDO with specified identity and properties.
    grantLDO = new GrantLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Grant",
      "properties": {
        "id": "http://schema.org/identifier",
        "class": "https://schema.org/url"
      }
    });
  });

  test("read should return Grant object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "grant123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Grant")
      .addStringNoLocale("http://schema.org/identifier", "grant123")
      .addStringNoLocale("https://schema.org/url", "https://example.com/class")
      .build();

    const result = grantLDO.read(mockThing);

    // Assert the returned Grant object has expected values.
    expect(result).toEqual({
      id: "grant123",
      class: "https://example.com/class"
    });
  });

  test("create should return ThingLocal representing Grant object", () => {
    const mockGrant: Grant = {
      id: "grant123",
      class: "https://example.com/class"
    };

    const result = grantLDO.create(mockGrant);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("grant123");
    expect(getStringNoLocale(result, "https://schema.org/url")).toBe("https://example.com/class");
  });
});
