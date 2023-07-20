import {
  ThingLocal,
  buildThing,
  createThing,
  getStringNoLocale
} from "@inrupt/solid-client";
import connectionDefinition from "../../definitions/connection.json";
import { ConnectionLDO } from "../../models/things/ConnectionLDO";
import { Connection } from "../../models/types/Connection";

describe("ConnectionLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const connectionLDO = new ConnectionLDO(connectionDefinition);

  test("should read a Connection object from a Linked Data Object", () => {
    const connectionLDOData: any = {
      id: "connection123",
      to: "https://example.com/to",
      from: "https://example.com/from",
    };

    const ldoThing: ThingLocal = buildThing(createThing({ name: connectionLDOData.id }))
      .addStringNoLocale(connectionDefinition.properties.id, connectionLDOData.id)
      .addStringNoLocale(connectionDefinition.properties.to, connectionLDOData.to)
      .addStringNoLocale(connectionDefinition.properties.from, connectionLDOData.from)
      .build();
    const connection: Connection = connectionLDO.read(ldoThing);
    expect(connection).toEqual(connectionLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Connection object", () => {
    const connection: Connection = {
      id: "connection456",
      to: "https://example.com/to",
      from: "https://example.com/from",
    };
    const ldoThing: ThingLocal = connectionLDO.create(connection);
    expect(ldoThing.url).toBe(`${rdfIdentity}connection456`);
    expect(getStringNoLocale(ldoThing, connectionDefinition.properties.id)).toBe(connection.id);
    expect(getStringNoLocale(ldoThing, connectionDefinition.properties.to)).toBe(connection.to);
    expect(getStringNoLocale(ldoThing, connectionDefinition.properties.from)).toBe(connection.from);
  });
});
