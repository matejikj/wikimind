import { buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";
import { rdf_type } from "../../LDO";
import { Connection } from "../../types/Connection";
import { ConnectionLDO } from "../ConnectionLDO";


/**
 * Tests for the ConnectionLDO class.
 */
describe("ConnectionLDO", () => {
  let connectionLDO: ConnectionLDO;

  beforeEach(() => {
    // Create a new instance of ConnectionLDO with specified identity and properties.
    connectionLDO = new ConnectionLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Connection",
      "properties": {
        "from": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#from",
        "to": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#to",
        "id": "http://schema.org/identifier"
      }
    });
  });

  test("read should return Connection object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "connection123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Connection")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#from", "https://example.com/from")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#to", "https://example.com/to")
      .addStringNoLocale("http://schema.org/identifier", "connection123")
      .build();

    const result = connectionLDO.read(mockThing);
    // Assert the returned Connection object has expected values.
    expect(result).toEqual({
      id: "connection123",
      to: "https://example.com/to",
      from: "https://example.com/from"
    });
  });

  test("create should return ThingLocal representing Connection object", () => {
    const mockConnection: Connection = {
      id: "connection123",
      to: "https://example.com/to",
      from: "https://example.com/from"
    };

    const result = connectionLDO.create(mockConnection);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#to")).toBe("https://example.com/to");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#from")).toBe("https://example.com/from");
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("connection123");
  });
});
