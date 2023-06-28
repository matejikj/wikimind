import { rdf_type } from "../LDO";
import { Connection } from "../types/Connection";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getBoolean, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Connection Linked Data Object (LDO) extending the BaseLDO class.
 * Provides CRUD operations for Connection objects.
 */
export class ConnectionLDO extends BaseLDO<Connection> implements CRUDLDO<Connection> {
  /**
   * Reads the provided Linked Data Object (LDO) and returns a Connection object.
   * @param thing The Linked Data Object (LDO) to read.
   * @returns The Connection object.
   */
  read(thing: any): Connection {
    return {
      id: getStringNoLocale(thing, this.rdf.properties.id)!,
      to: getStringNoLocale(thing, this.rdf.properties.to)!,
      from: getStringNoLocale(thing, this.rdf.properties.from)!,
      title: getStringNoLocale(thing, this.rdf.properties.title)!,
      testable: getBoolean(thing, this.rdf.properties.testable)!,
    };
  }

  /**
   * Creates a new Linked Data Object (LDO) from the provided Connection object.
   * @param object The Connection object to create.
   * @returns The newly created ThingLocal instance representing the Connection object.
   */
  create(object: Connection): ThingLocal {
    const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
      .addUrl(rdf_type, this.rdf.identity)
      .addStringNoLocale(this.rdf.properties.from, object.from)
      .addBoolean(this.rdf.properties.testable, object.testable)
      .addStringNoLocale(this.rdf.properties.to, object.to)
      .addStringNoLocale(this.rdf.properties.id, object.id)
      .addStringNoLocale(this.rdf.properties.title, object.title)
      .build();
    return newThing;
  }
}
