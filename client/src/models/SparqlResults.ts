import { ResultItem } from "./ResultItem";

/**
 * Represents the results of a SPARQL query.
 */
export type SparqlResults = {
  /**
   * The head information of the SPARQL results.
   */
  head: {
    /**
     * An array of link URLs associated with the results.
     */
    link: string[];
    
    /**
     * An array of variable names used in the query.
     */
    vars: string[];
  };
  
  /**
   * The results information of the SPARQL query.
   */
  results: {
    /**
     * Indicates whether the results are distinct (true) or not (false).
     */
    distinct: boolean;
    
    /**
     * Indicates whether the results are ordered (true) or not (false).
     */
    ordered: boolean;
    
    /**
     * An array of result items containing the actual query results.
     */
    bindings: ResultItem[];
  };
};
