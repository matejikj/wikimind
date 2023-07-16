import { rdf_type } from "../../LDO";
import { Node } from "../../types/Node";
import { BaseLDO } from "../BaseLDO";
import { CRUDLDO } from "../CRUDLDO";
import { ThingLocal, buildThing, createThing, getBoolean, getInteger, getStringNoLocale } from "@inrupt/solid-client";
import { NodeLDO } from "../NodeLDO";

/**
 * Represents a Linked Data Object (LDO) for a node.
 */
jest.mock("../../../service/containerService", () => {
  return {
    WIKIMIND: 'WikiMind',
  };
});

/**
 * Tests for the ProfileLDO class.
 */
describe("ProfileLDO", () => {
  let nodeLDO: NodeLDO;

  beforeEach(() => {
    // Create a new instance of NodeLDO with specified identity and properties.
    nodeLDO = new NodeLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Node",
      "properties": {
        "id": "http://schema.org/identifier",
        "uri": "http://schema.org/uri",
        "description": "https://schema.org/description",
        "title": "http://schema.org/name",
        "cx": "http://schema.org/distance",
        "cy": "http://schema.org/email",
        "color": "http://schema.org/color",
        "textColor": "http://schema.org/textColor",
        "isInTest": "https://schema.org/Product"
      }
    });
  });

  
  test("read should return Node object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "mockNode" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Node")
      .addStringNoLocale("http://schema.org/identifier", "node1")
      .addInteger("http://schema.org/distance", 10)
      .addInteger("http://schema.org/email", 20)
      .addStringNoLocale("http://schema.org/name", "Node Title")
      .addStringNoLocale("http://schema.org/uri", "https://example.com/node1")
      .addStringNoLocale("https://schema.org/description", "Node Description")
      .addStringNoLocale("http://schema.org/textColor", "#000000")
      .addStringNoLocale("http://schema.org/color", "#FFFFFF")
      .addBoolean("https://schema.org/Product", true)
      .build();

    const result = nodeLDO.read(mockThing);

    // Assert the returned Node object has expected values.
    expect(result).toEqual({
      id: "node1",
      cx: 10,
      cy: 20,
      title: "Node Title",
      uri: "https://example.com/node1",
      description: "Node Description",
      textColor: "#000000",
      color: "#FFFFFF",
      isInTest: true
    });
  });

  test("create should return ThingLocal representing Node object", () => {
    const mockNode: Node = {
      id: "node1",
      cx: 10,
      cy: 20,
      title: "Node Title",
      uri: "https://example.com/node1",
      description: "Node Description",
      textColor: "#000000",
      color: "#FFFFFF",
      isInTest: true
    };

    const result = nodeLDO.create(mockNode);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("node1");
    expect(getInteger(result, "http://schema.org/distance")).toBe(10);
    expect(getInteger(result, "http://schema.org/email")).toBe(20);
    expect(getStringNoLocale(result, "http://schema.org/name")).toBe("Node Title");
    expect(getStringNoLocale(result, "http://schema.org/uri")).toBe("https://example.com/node1");
    expect(getStringNoLocale(result, "https://schema.org/description")).toBe("Node Description");
    expect(getStringNoLocale(result, "http://schema.org/textColor")).toBe("#000000");
    expect(getStringNoLocale(result, "http://schema.org/color")).toBe("#FFFFFF");
    expect(getBoolean(result, "https://schema.org/Product")).toBe(true);
  });
});
