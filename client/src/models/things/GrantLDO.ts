import { rdf_type } from "../LDO";
import { Grant } from "../types/Grant";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Class Request Grant Linked Data Object (LDO) extending the BaseLDO class.
 * Provides CRUD operations for Grant objects related to classes.
 */
export class GrantLDO extends BaseLDO<Grant> implements CRUDLDO<Grant> {
  /**
   * Reads the provided Linked Data Object (LDO) and returns a Grant object.
   * @param thing The Linked Data Object (LDO) to read.
   * @returns The Grant object.
   */
  read(thing: any): Grant {
    return {
      id: getStringNoLocale(thing, this.rdf.properties.id)!,
      class: getStringNoLocale(thing, this.rdf.properties.class)!,
    };
  }

  /**
   * Creates a new Linked Data Object (LDO) from the provided Grant object.
   * @param object The Grant object to create.
   * @returns The newly created ThingLocal instance representing the Grant object.
   */
  create(object: Grant): ThingLocal {
    const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
      .addUrl(rdf_type, this.rdf.identity)
      .addStringNoLocale(this.rdf.properties.id, object.id)
      .addStringNoLocale(this.rdf.properties.class, object.class)
      .build();
    return newThing;
  }
}
