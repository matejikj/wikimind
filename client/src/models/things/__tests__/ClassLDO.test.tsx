import { rdf_type } from "../../LDO";
import { Class } from "../../types/Class";
import { ClassLDO } from "../ClassLDO";
import { createThing, getStringNoLocale, buildThing, addStringNoLocale, addUrl } from "@inrupt/solid-client";

/**
 * Tests for the ClassLDO class.
 */
describe("ClassLDO", () => {
  let classLDO: ClassLDO;

  beforeEach(() => {
    // Create a new instance of ClassLDO with specified identity and properties.
    classLDO = new ClassLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Class",
      "properties": {
        "name": "http://schema.org/name",
        "id": "http://schema.org/identifier",
        "teacher": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#teacher",
        "storage": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#storage"
      }
    });
  });

  test("read should return Class object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "Math" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Class")
      .addStringNoLocale("http://schema.org/name", "Math")
      .addStringNoLocale("http://schema.org/identifier", "class123")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#teacher", "https://example.com/teacher")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#storage", "https://example.com/storage")
      .build();

    const result = classLDO.read(mockThing);

    // Assert the returned Class object has expected values.
    expect(result).toEqual({
      name: "Math",
      id: "class123",
      teacher: "https://example.com/teacher",
      storage: "https://example.com/storage"
    });
  });

  test("create should return ThingLocal representing Class object", () => {
    const mockClass: Class = {
      name: "Math",
      id: "class123",
      teacher: "https://example.com/teacher",
      storage: "https://example.com/storage"
    };

    const result = classLDO.create(mockClass);

    // Assert the returned ThingLocal has expected property values.
    expect(getStringNoLocale(result, "http://schema.org/name")).toBe("Math");
    expect(getStringNoLocale(result, "http://schema.org/identifier")).toBe("class123");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#teacher")).toBe("https://example.com/teacher");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#storage")).toBe("https://example.com/storage");
  });
});
