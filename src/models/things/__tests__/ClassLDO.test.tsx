import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { ClassLDO } from "../ClassLDO";
import { Class } from "../../types/Class";
import classDefinition from "../../../definitions/class.json";

describe("ClassLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const classLDO = new ClassLDO(classDefinition);

  test("should read a Class object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with class data
    const classLDOData: any = {
      name: "History 101",
      id: "class123",
      teacher: "https://example.com/teacher123",
      source: "https://example.com/classSource",
      storage: "https://example.com/classStorage",
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: classLDOData.id }))
      .addStringNoLocale(classDefinition.properties.name, classLDOData.name)
      .addStringNoLocale(classDefinition.properties.id, classLDOData.id)
      .addStringNoLocale(classDefinition.properties.teacher, classLDOData.teacher)
      .addStringNoLocale(classDefinition.properties.source, classLDOData.source)
      .addStringNoLocale(classDefinition.properties.storage, classLDOData.storage)
      .build();

    // Call the read method to convert the LDO to a Class object
    const classObj: Class = classLDO.read(ldoThing);

    // Check if the Class object matches the input data
    expect(classObj).toEqual(classLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Class object", () => {
    // Prepare the Class object
    const classObj: Class = {
      name: "Mathematics 202",
      id: "class456",
      teacher: "https://example.com/teacher456",
      source: "https://example.com/classSource456",
      storage: "https://example.com/classStorage456",
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = classLDO.create(classObj);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}class456`);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.name)).toBe(classObj.name);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.id)).toBe(classObj.id);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.teacher)).toBe(classObj.teacher);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.source)).toBe(classObj.source);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.storage)).toBe(classObj.storage);
  });
});
