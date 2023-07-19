import { DBpediaQueryBuilder } from "../../dbpedia/DBPediaQueryBuilder";

describe("DBpediaQueryBuilder", () => {
  describe("buildQuery", () => {
    it("should build a simple query with one prefix, one select variable, and one where clause", () => {
      const queryBuilder = new DBpediaQueryBuilder();
      queryBuilder.addPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
      queryBuilder.addSelectVariable("label");
      queryBuilder.addWhereClause("?entity rdfs:label ?label.");
      const expectedQuery = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?label
WHERE {
?entity rdfs:label ?label.
}`;
      expect(queryBuilder.buildQuery()).toEqual(expectedQuery);
    });

    it("should build a more complex query with multiple prefixes, select variables, and where clauses", () => {
      const queryBuilder = new DBpediaQueryBuilder();
      queryBuilder.addPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
      queryBuilder.addPrefix("dbo", "http://dbpedia.org/ontology/");
      queryBuilder.addPrefix("dcterms", "http://purl.org/dc/terms/");
      queryBuilder.addSelectVariable("entity");
      queryBuilder.addSelectVariable("label");
      queryBuilder.addWhereClause("<http://dbpedia.org/resource/Ewan_McGregor> ?type ?entity.");
      queryBuilder.addWhereClause("?entity rdfs:label ?label.");
      queryBuilder.addWhereClause("FILTER (?type = dbo:wikiPageWikiLink || ?type = dcterms:subject)");
      const expectedQuery = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT DISTINCT ?entity ?label
WHERE {
<http://dbpedia.org/resource/Ewan_McGregor> ?type ?entity.
?entity rdfs:label ?label.
FILTER (?type = dbo:wikiPageWikiLink || ?type = dcterms:subject)
}`;
      expect(queryBuilder.buildQuery()).toEqual(expectedQuery);
    });
  });
});
