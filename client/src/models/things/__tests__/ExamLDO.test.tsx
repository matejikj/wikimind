import {
  ThingLocal,
  buildThing,
  createThing,
  setInteger,
  getInteger,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { ExamLDO } from "../ExamLDO";
import { Exam } from "../../types/Exam";
import examDefinition from "../../../definitions/exam.json";

describe("ExamLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const examLDO = new ExamLDO(examDefinition);

  test("should read an Exam object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with exam data
    const examLDOData: any = {
      max: 100,
      result: 85,
      mindMap: "https://example.com/mindMap123",
      profile: "https://example.com/profile456",
      id: "exam123",
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: examLDOData.id }))
      .addInteger(examDefinition.properties.max, examLDOData.max)
      .addInteger(examDefinition.properties.result, examLDOData.result)
      .addStringNoLocale(examDefinition.properties.mindMap, examLDOData.mindMap)
      .addStringNoLocale(examDefinition.properties.profile, examLDOData.profile)
      .addStringNoLocale(examDefinition.properties.id, examLDOData.id)
      .build();

    // Call the read method to convert the LDO to an Exam object
    const exam: Exam = examLDO.read(ldoThing);

    // Check if the Exam object matches the input data
    expect(exam).toEqual(examLDOData);
  });

  test("should create a Linked Data Object (LDO) from an Exam object", () => {
    // Prepare the Exam object
    const exam: Exam = {
      max: 200,
      result: 180,
      mindMap: "https://example.com/mindMap789",
      profile: "https://example.com/profile012",
      id: "exam456",
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = examLDO.create(exam);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}exam456`);
    expect(getInteger(ldoThing, examDefinition.properties.max)).toBe(exam.max);
    expect(getInteger(ldoThing, examDefinition.properties.result)).toBe(exam.result);
    expect(getStringNoLocale(ldoThing, examDefinition.properties.mindMap)).toBe(exam.mindMap);
    expect(getStringNoLocale(ldoThing, examDefinition.properties.profile)).toBe(exam.profile);
    expect(getStringNoLocale(ldoThing, examDefinition.properties.id)).toBe(exam.id);
  });
});
