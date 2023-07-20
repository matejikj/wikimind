import {
  ThingLocal,
  buildThing,
  createThing,
  getStringNoLocale
} from "@inrupt/solid-client";
import mindMapDefinition from "../../definitions/mindMap.json";
import { MindMapLDO } from "../../models/things/MindMapLDO";
import { MindMap } from "../../models/types/MindMap";

describe("MindMapLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const mindMapLDO = new MindMapLDO(mindMapDefinition);

  test("should read a MindMap object from a Linked Data Object", () => {
    const mindMapLDOData: any = {
      id: "mindMap123",
      name: "My Mind Map",
      storage: "https://example.com/mindMap123",
      source: "https://example.com/mindMapSource",
      created: "2023-07-17T12:34:56Z",
    };
    const ldoThing: ThingLocal = buildThing(createThing({ name: mindMapLDOData.id }))
      .addStringNoLocale(mindMapDefinition.properties.id, mindMapLDOData.id)
      .addStringNoLocale(mindMapDefinition.properties.name, mindMapLDOData.name)
      .addStringNoLocale(mindMapDefinition.properties.storage, mindMapLDOData.storage)
      .addStringNoLocale(mindMapDefinition.properties.source, mindMapLDOData.source)
      .addStringNoLocale(mindMapDefinition.properties.created, mindMapLDOData.created)
      .build();
    const mindMap: MindMap = mindMapLDO.read(ldoThing);
    expect(mindMap).toEqual(mindMapLDOData);
  });

  test("should create a Linked Data Object (LDO) from a MindMap object", () => {
    const mindMap: MindMap = {
      id: "mindMap456",
      name: "Mind Map",
      storage: "https://example.com/mindMap456",
      source: "https://example.com/mindMapSource456",
      created: "2023-07-18T09:00:00Z",
    };
    const ldoThing: ThingLocal = mindMapLDO.create(mindMap);
    expect(ldoThing.url).toBe(`${rdfIdentity}mindMap456`);
    expect(getStringNoLocale(ldoThing, mindMapDefinition.properties.id)).toBe(mindMap.id);
    expect(getStringNoLocale(ldoThing, mindMapDefinition.properties.name)).toBe(mindMap.name);
    expect(getStringNoLocale(ldoThing, mindMapDefinition.properties.storage)).toBe(mindMap.storage);
    expect(getStringNoLocale(ldoThing, mindMapDefinition.properties.source)).toBe(mindMap.source);
    expect(getStringNoLocale(ldoThing, mindMapDefinition.properties.created)).toBe(mindMap.created);
  });
});
