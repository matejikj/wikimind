/**
 * The RDF type property URI.
 */
export const rdf_type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

/**
 * Represents the properties of an LDO (Linked Data Object).
 * The keys are property names, and the values are the corresponding property URIs.
 */
type LDOProperties<T> = {
  [Property in keyof T]: string;
}

/**
 * Represents a Linked Data Object (LDO) with an identity and its associated properties.
 */
export type LDO<T> = {
  /**
   * The identity of the LDO.
   */
  identity: string;
  
  /**
   * The properties of the LDO.
   */
  properties: LDOProperties<T>;
}
