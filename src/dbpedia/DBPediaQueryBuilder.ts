export class DBpediaQueryBuilder {
    private prefixes: string[];
    private selectVariables: string[];
    private whereClauses: string[];
  
    constructor() {
      this.prefixes = [];
      this.selectVariables = [];
      this.whereClauses = [];
    }
  
    addPrefix(prefix: string, uri: string): void {
      const prefixLine = `PREFIX ${prefix}: <${uri}>`;
      this.prefixes.push(prefixLine);
    }
  
    addSelectVariable(variable: string): void {
      this.selectVariables.push(`?${variable}`);
    }
  
    addWhereClause(clause: string): void {
      this.whereClauses.push(clause);
    }
  
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
  