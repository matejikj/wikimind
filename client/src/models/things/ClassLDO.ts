import { rdf_type } from "../LDO";
import { Class } from "../types/Class";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, createThing, getStringNoLocale } from "@inrupt/solid-client";

/**
 * Represents a Class Linked Data Object (LDO) extending the BaseLDO class.
 * Provides CRUD operations for Class objects.
 */
export class ClassLDO extends BaseLDO<Class> implements CRUDLDO<Class> {
  /**
   * Reads the provided Linked Data Object (LDO) and returns a Class object.
   * @param thing The Linked Data Object (LDO) to read.
   * @returns The Class object.
   */
  read(thing: any): Class {
    return {
      name: getStringNoLocale(thing, this.rdf.properties.name)!,
      id: getStringNoLocale(thing, this.rdf.properties.id)!,
      teacher: getStringNoLocale(thing, this.rdf.properties.teacher)!,
      storage: getStringNoLocale(thing, this.rdf.properties.storage)!,
    };
  }

  /**
   * Creates a new Linked Data Object (LDO) from the provided Class object.
   * @param object The Class object to create.
   * @returns The newly created ThingLocal instance representing the Class object.
   */
  create(object: Class): ThingLocal {
    const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
      .addUrl(rdf_type, this.rdf.identity)
      .addStringNoLocale(this.rdf.properties.id, object.id)
      .addStringNoLocale(this.rdf.properties.name, object.name)
      .addStringNoLocale(this.rdf.properties.teacher, object.teacher)
      .addStringNoLocale(this.rdf.properties.storage, object.storage)
      .build();
    return newThing;
  }
}
