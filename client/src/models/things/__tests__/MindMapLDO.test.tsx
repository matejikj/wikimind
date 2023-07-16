import { buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";
import { rdf_type } from "../../LDO";
import { MindMap } from "../../types/MindMap";
import { MindMapLDO } from "../MindMapLDO";


/**
 * Tests for the MindMapLDO class.
 */
describe("MindMapLDO", () => {
  let mindMapLDO: MindMapLDO;

  beforeEach(() => {
    // Create a new instance of MindMapLDO with specified identity and properties.
    mindMapLDO = new MindMapLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#MindMap",
      "properties": {
        "created": "https://schema.org/dateCreated",
        "id": "http://schema.org/identifier"
      }
    });
  });

  test("read should return MindMap object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "mindmap123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#MindMap")
      .addStringNoLocale("https://schema.org/dateCreated", "2023-07-04")
      .addStringNoLocale("http://schema.org/identifier", "mindmap123")
      .build();

    const result = mindMapLDO.read(mockThing);

    // Assert the returned MindMap object has expected values.
    expect(result).toEqual({
      id: "mindmap123",
      created: "2023-07-04"
    });
  });

  test("create should return ThingLocal representing MindMap object", () => {
    const mockMindMap: MindMap = {
      id: "mindmap123",
      created: "2023-07-04"
    };

    const result = mindMapLDO.create(mockMindMap);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("mindmap123");
    expect(getStringNoLocale(result, "https://schema.org/dateCreated")).toBe("2023-07-04");
  });
});
