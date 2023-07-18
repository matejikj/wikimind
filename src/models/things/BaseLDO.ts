import { LDO } from "../LDO";

/**
 * Represents a Base Linked Data Object (LDO) with a generic type.
 * Provides a base class for working with LDOs.
 */
export class BaseLDO<T> {
    /**
     * The underlying Linked Data Object (LDO) instance.
     */
    protected rdf: LDO<T>;
  
    /**
     * Creates a new instance of the BaseLDO class.
     * @param rdf The Linked Data Object (LDO) instance.
     */
    constructor(rdf: LDO<T>) {
      this.rdf = rdf;
    }
  }
  