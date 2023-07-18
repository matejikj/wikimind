import { LanguageLocalization } from "../../../models/UserSession";
import { DBpediaCategoryQuery } from "../DBPediaCategoryQuery";

describe("DBpediaCategoryQuery", () => {
  describe("constructor", () => {
    it("should create a query with English localization", () => {
      const entity = "http://dbpedia.org/resource/Category:Programming_languages";
      const localization = LanguageLocalization.EN;
      const query = new DBpediaCategoryQuery(entity, localization);
      const aa = query.buildQuery()
      const expectedQuery = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?entity ?label
WHERE {

{
  <http://dbpedia.org/resource/Category:Programming_languages> ?type ?entity.
  ?entity rdfs:label ?label.
  FILTER (?type = skos:broader || ?type = dcterms:subject)

  FILTER (lang(?label) = "en")

}
  UNION
{
  ?entity ?type <http://dbpedia.org/resource/Category:Programming_languages>.
  ?entity rdfs:label ?label.
  FILTER (?type = skos:broader || ?type = dcterms:subject)
  FILTER (lang(?label) = "en")
}
      `;
      expect(query.buildQuery()).toEqual(expectedQuery.trim());
    });

    it("should create a query with Czech localization", () => {
const entity = "http://dbpedia.org/resource/Category:Programming_languages";
const localization = LanguageLocalization.CS;
const query = new DBpediaCategoryQuery(entity, localization);
const expectedQuery = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dcterms: <http://purl.org/dc/terms/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  SELECT ?entity ?label
  WHERE {
    <http://dbpedia.org/resource/Category:Programming_languages> ?type ?entity.
    ?entity rdfs:label ?label.
    FILTER (?type = skos:broader || ?type = dcterms:subject)
    FILTER (lang(?label) = "cs" || lang(?label) = "en")
  }
  UNION
  {
    ?entity ?type <http://dbpedia.org/resource/Category:Programming_languages>.
    ?entity rdfs:label ?label.
    FILTER (?type = skos:broader || ?type = dcterms:subject)
    FILTER (lang(?label) = "cs" || lang(?label) = "en")
  }
`;
      expect(query.buildQuery()).toEqual(expectedQuery.trim());
    });
  });
});
