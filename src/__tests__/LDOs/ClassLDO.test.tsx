import {
  ThingLocal,
  buildThing,
  createThing,
  getStringNoLocale
} from "@inrupt/solid-client";
import classDefinition from "../../definitions/class.json";
import { ClassLDO } from "../../models/things/ClassLDO";
import { Class } from "../../models/types/Class";

describe("ClassLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const classLDO = new ClassLDO(classDefinition);

  test("should read a Class object from a Linked Data Object", () => {
    const classLDOData: any = {
      name: "dejepis",
      id: "class",
      teacher: "https://example.com/teacher123",
      source: "https://example.com/classSource",
      storage: "https://example.com/classStorage",
    };
    const ldoThing: ThingLocal = buildThing(createThing({ name: classLDOData.id }))
      .addStringNoLocale(classDefinition.properties.name, classLDOData.name)
      .addStringNoLocale(classDefinition.properties.id, classLDOData.id)
      .addStringNoLocale(classDefinition.properties.teacher, classLDOData.teacher)
      .addStringNoLocale(classDefinition.properties.source, classLDOData.source)
      .addStringNoLocale(classDefinition.properties.storage, classLDOData.storage)
      .build();
    const classObj: Class = classLDO.read(ldoThing);
    expect(classObj).toEqual(classLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Class object", () => {
    const classObj: Class = {
      name: "Mathematics 202",
      id: "class456",
      teacher: "https://example.com/teacher456",
      source: "https://example.com/classSource456",
      storage: "https://example.com/classStorage456",
    };
    const ldoThing: ThingLocal = classLDO.create(classObj);
    expect(ldoThing.url).toBe(`${rdfIdentity}class456`);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.name)).toBe(classObj.name);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.id)).toBe(classObj.id);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.teacher)).toBe(classObj.teacher);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.source)).toBe(classObj.source);
    expect(getStringNoLocale(ldoThing, classDefinition.properties.storage)).toBe(classObj.storage);
  });
});
