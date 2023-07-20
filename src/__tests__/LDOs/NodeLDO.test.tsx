import {
  ThingLocal,
  buildThing,
  createThing,
  getBoolean,
  getInteger,
  getStringNoLocale
} from "@inrupt/solid-client";
import nodeDefinition from "../../definitions/node.json";
import { NodeLDO } from "../../models/things/NodeLDO";
import { Node } from "../../models/types/Node";

describe("NodeLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const nodeLDO = new NodeLDO(nodeDefinition);

  test("should read a Node object from a Linked Data Object", () => {
    const nodeLDOData: any = {
      id: "node123",
      cx: 100,
      cy: 200,
      title: "My Node",
      uri: "https://example.com/node123",
      description: "This is a test node.",
      textColor: "black",
      color: "white",
      isInTest: true,
    };
    const ldoThing: ThingLocal = buildThing(createThing({ name: nodeLDOData.id }))
      .addInteger(nodeDefinition.properties.cx, nodeLDOData.cx)
      .addInteger(nodeDefinition.properties.cy, nodeLDOData.cy)
      .addStringNoLocale(nodeDefinition.properties.title, nodeLDOData.title)
      .addStringNoLocale(nodeDefinition.properties.id, nodeLDOData.id)
      .addStringNoLocale(nodeDefinition.properties.uri, nodeLDOData.uri)
      .addStringNoLocale(nodeDefinition.properties.description, nodeLDOData.description)
      .addStringNoLocale(nodeDefinition.properties.textColor, nodeLDOData.textColor)
      .addStringNoLocale(nodeDefinition.properties.color, nodeLDOData.color)
      .addBoolean(nodeDefinition.properties.isInTest, nodeLDOData.isInTest)
      .build();
    const node: Node = nodeLDO.read(ldoThing);
    expect(node).toEqual(nodeLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Node object", () => {
    const node: Node = {
      id: "node456",
      cx: 300,
      cy: 400,
      title: "Node",
      uri: "https://example.com/node456",
      description: "This is another test node.",
      textColor: "blue",
      color: "yellow",
      isInTest: false,
    };
    const ldoThing: ThingLocal = nodeLDO.create(node);
    expect(ldoThing.url).toBe(`${rdfIdentity}node456`);
    expect(getInteger(ldoThing, nodeDefinition.properties.cx)).toBe(node.cx);
    expect(getInteger(ldoThing, nodeDefinition.properties.cy)).toBe(node.cy);
    expect(getStringNoLocale(ldoThing, nodeDefinition.properties.title)).toBe(node.title);
    expect(getStringNoLocale(ldoThing, nodeDefinition.properties.uri)).toBe(node.uri);
    expect(getStringNoLocale(ldoThing, nodeDefinition.properties.description)).toBe(node.description);
    expect(getStringNoLocale(ldoThing, nodeDefinition.properties.textColor)).toBe(node.textColor);
    expect(getStringNoLocale(ldoThing, nodeDefinition.properties.color)).toBe(node.color);
    expect(getBoolean(ldoThing, nodeDefinition.properties.isInTest)).toBe(node.isInTest);
  });
});
