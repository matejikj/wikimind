import { rdf_type } from "../../LDO";
import { Request } from "../../types/Request";
import { RequestLDO } from "../RequestLDO";
import { createThing, getStringNoLocale, buildThing, addStringNoLocale, addUrl } from "@inrupt/solid-client";

/**
 * Tests for the RequestLDO class.
 */
describe("RequestLDO", () => {
  let requestLDO: RequestLDO;

  beforeEach(() => {
    // Create a new instance of RequestLDO with specified identity and properties.
    requestLDO = new RequestLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Request",
      "properties": {
        "requestor": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#requestor",
        "id": "http://schema.org/identifier",
        "subject": "http://schema.org/url"
      }
    });
  });

  test("read should return Request object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "request123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Request")
      .addStringNoLocale("http://schema.org/identifier", "request123")
      .addStringNoLocale("http://schema.org/url", "https://example.com")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#requestor", "user123")
      .build();

    const result = requestLDO.read(mockThing);

    // Assert the returned Request object has expected values.
    expect(result).toEqual({
      id: "request123",
      class: "https://example.com",
      requestor: "user123"
    });
  });

  test("create should return ThingLocal representing Request object", () => {
    const mockRequest: Request = {
      id: "request123",
      subject: "https://example.com",
      requestor: "user123"
    };

    const result = requestLDO.create(mockRequest);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("request123");
    expect(getStringNoLocale(result, "http://schema.org/url")).toBe("https://example.com");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#requestor")).toBe("user123");
  });
});
