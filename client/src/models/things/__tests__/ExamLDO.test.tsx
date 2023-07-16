import { buildThing, createThing, getInteger, getStringNoLocale } from "@inrupt/solid-client";
import { rdf_type } from "../../LDO";
import { Exam } from "../../types/Exam";
import { ExamLDO } from "../ExamLDO";


/**
 * Tests for the ExamLDO class.
 */
describe("ExamLDO", () => {
  let examLDO: ExamLDO;

  beforeEach(() => {
    // Create a new instance of ExamLDO with specified identity and properties.
    examLDO = new ExamLDO({
      "identity": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Exam",
      "properties": {
        "max": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#max",
        "result": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#result",
        "id": "http://schema.org/email",
        "mindMap": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#mindMap",
        "profile": "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#profile"
      }
    });
  });

  test("read should return Exam object", () => {
    // Create a mock Thing with relevant properties.
    const mockThing = buildThing(createThing({ name: "exam123" }))
      .addUrl(rdf_type, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#Exam")
      .addInteger("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#max", 100)
      .addInteger("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#result", 85)
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#mindMap", "https://example.com/mindmap")
      .addStringNoLocale("https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#profile", "https://example.com/profile")
      .addStringNoLocale("http://schema.org/email", "exam123")
      .build();
    const result = examLDO.read(mockThing);

    // Assert the returned Exam object has expected values.
    expect(result).toEqual({
      max: 100,
      result: 85,
      mindMap: "https://example.com/mindmap",
      profile: "https://example.com/profile",
      id: "exam123"
    });
  });

  test("create should return ThingLocal representing Exam object", () => {
    const mockExam: Exam = {
      max: 100,
      result: 85,
      mindMap: "https://example.com/mindmap",
      profile: "https://example.com/profile",
      id: "exam123"
    };

    const result = examLDO.create(mockExam);

    // Assert the returned ThingLocal has expected property values.
    expect(getInteger(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#max")).toBe(100);
    expect(getInteger(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#result")).toBe(85);
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#mindMap")).toBe("https://example.com/mindmap");
    expect(getStringNoLocale(result, "https://github.com/matejikj/diplomka/blob/master/wikimind.ttl#profile")).toBe("https://example.com/profile");
    expect(getStringNoLocale(result, "http://schema.org/email")).toBe("exam123");
  });
});
