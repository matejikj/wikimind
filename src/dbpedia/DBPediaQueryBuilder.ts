/**
 * Represents a DBpedia query builder for constructing SPARQL queries to interact with the DBpedia dataset.
 */
export class DBpediaQueryBuilder {
  private prefixes: string[];
  private selectVariables: string[];
  private whereClauses: string[];

  /**
   * Constructs a new instance of the DBpediaQueryBuilder class.
   * Initializes the prefixes, selectVariables, and whereClauses arrays.
   */
  constructor() {
      this.prefixes = [];
      this.selectVariables = [];
      this.whereClauses = [];
  }

  /**
   * Adds a prefix to the query.
   * @param prefix - The prefix to be added.
   * @param uri - The URI associated with the prefix.
   */
  addPrefix(prefix: string, uri: string): void {
      const prefixLine = `PREFIX ${prefix}: <${uri}>`;
      this.prefixes.push(prefixLine);
  }

  /**
   * Adds a SELECT variable to the query.
   * @param variable - The SELECT variable to be added.
   */
  addSelectVariable(variable: string): void {
      this.selectVariables.push(`?${variable}`);
  }

  /**
   * Adds a WHERE clause to the query.
   * @param clause - The WHERE clause to be added.
   */
  addWhereClause(clause: string): void {
      this.whereClauses.push(clause);
  }

  /**
   * Builds and returns the final SPARQL query.
   * @returns The complete SPARQL query as a string.
   */
  buildQuery(): string {
      const query = [
          ...this.prefixes,
          `SELECT DISTINCT ${this.selectVariables.join(' ')}`,
          'WHERE {',
          ...this.whereClauses,
          '}'
      ].join('\n');

      return query;
  }
}
