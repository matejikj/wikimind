import {
  ThingLocal,
  buildThing,
  createThing,
  setStringNoLocale,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { ConnectionLDO } from "../ConnectionLDO";
import { Connection } from "../../types/Connection";
import connectionDefinition from "../../../definitions/connection.json";

describe("ConnectionLDO", () => {
  const rdfIdentity = "https://inrupt.com/.well-known/sdk-local-node/";
  const connectionLDO = new ConnectionLDO(connectionDefinition);

  test("should read a Connection object from a Linked Data Object", () => {
    // Prepare the Linked Data Object (LDO) with connection data
    const connectionLDOData: any = {
      id: "connection123",
      to: "https://example.com/toUser",
      from: "https://example.com/fromUser",
    };

    // Create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = buildThing(createThing({ name: connectionLDOData.id }))
      .addStringNoLocale(connectionDefinition.properties.id, connectionLDOData.id)
      .addStringNoLocale(connectionDefinition.properties.to, connectionLDOData.to)
      .addStringNoLocale(connectionDefinition.properties.from, connectionLDOData.from)
      .build();

    // Call the read method to convert the LDO to a Connection object
    const connection: Connection = connectionLDO.read(ldoThing);

    // Check if the Connection object matches the input data
    expect(connection).toEqual(connectionLDOData);
  });

  test("should create a Linked Data Object (LDO) from a Connection object", () => {
    // Prepare the Connection object
    const connection: Connection = {
      id: "connection456",
      to: "https://example.com/toUser456",
      from: "https://example.com/fromUser456",
    };

    // Call the create method to create a ThingLocal representing the LDO
    const ldoThing: ThingLocal = connectionLDO.create(connection);

    // Check if the created ThingLocal contains the correct values
    expect(ldoThing.url).toBe(`${rdfIdentity}connection456`);
    expect(getStringNoLocale(ldoThing, connectionDefinition.properties.id)).toBe(connection.id);
    expect(getStringNoLocale(ldoThing, connectionDefinition.properties.to)).toBe(connection.to);
    expect(getStringNoLocale(ldoThing, connectionDefinition.properties.from)).toBe(connection.from);
  });
});
