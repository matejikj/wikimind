import { LanguageLocalization } from "../../models/UserSession";
import { DBPediaEntityQuery } from "../../dbpedia/queries/DBPediaEntityQuery";

describe("DBPediaEntityQuery", () => {
    describe("constructor", () => {
        it("should create a query with English localization", () => {
            const entity = "http://dbpedia.org/resource/Ewan_McGregor";
            const localization = LanguageLocalization.CS;
            const query = new DBPediaEntityQuery(entity, localization);
            const expectedQuery = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?entity ?label
WHERE {

      <http://dbpedia.org/resource/Ewan_McGregor> ?type ?entity.
      ?entity rdfs:label ?label.
      FILTER (?type = dbo:wikiPageWikiLink || ?type = dcterms:subject)
      FILTER (lang(?label) = "cs" || lang(?label) = "en")
      
}`;
            expect(query.buildQuery()).toEqual(expectedQuery.trim());
        });

        it("should create a query with Czech localization", () => {
            const entity = "http://dbpedia.org/resource/Category:Programming_languages";
            const localization = LanguageLocalization.EN;
            const query = new DBPediaEntityQuery(entity, localization);
            const expectedQuery = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?entity ?label
WHERE {

      <http://dbpedia.org/resource/Category:Programming_languages> ?type ?entity.
      ?entity rdfs:label ?label.
      FILTER (?type = dbo:wikiPageWikiLink || ?type = dcterms:subject)
      FILTER (lang(?label) = "en")
      
}
`;
            expect(query.buildQuery()).toEqual(expectedQuery.trim());
        });
    });
});