import { ThingLocal } from '@inrupt/solid-client';

/**
 * Represents a CRUD (Create, Read, Update, Delete) interface for Linked Data Objects (LDOs).
 * @template T The type of the Linked Data Object (LDO).
 */
export interface CRUDLDO<T> {
  /**
   * Creates a new Linked Data Object (LDO) from the provided object.
   * @param object The object to create.
   * @returns The newly created ThingLocal instance representing the object.
   */
  create: (object: T) => ThingLocal;

  /**
   * Reads the provided Linked Data Object (LDO) and returns an object of type T.
   * @param thing The Linked Data Object (LDO) to read.
   * @returns The object of type T.
   */
  read: (thing: ThingLocal) => T;
}
