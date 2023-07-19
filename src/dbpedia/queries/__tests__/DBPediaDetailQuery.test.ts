import { LanguageLocalization } from "../../../models/UserSession";
import { DBPediaDetailQuery } from "../DBPediaDetailQuery";

describe("DBPediaDetailQuery", () => {
  describe("constructor", () => {
    it("should create a query with English localization", () => {
      const entity = "http://dbpedia.org/resource/Ewan_McGregor";
      const localization = LanguageLocalization.CS;
      const query = new DBPediaDetailQuery(entity, localization);
      const expectedQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?abstract
WHERE {

    <http://dbpedia.org/resource/Ewan_McGregor> dbo:abstract ?abstract.
    FILTER (lang(?abstract) = "cs" || lang(?abstract) = "en")
    
}`;
      expect(query.buildQuery()).toEqual(expectedQuery.trim());
    });

    it("should create a query with Czech localization", () => {
      const entity = "http://dbpedia.org/resource/Category:Programming_languages";
      const localization = LanguageLocalization.EN;
      const query = new DBPediaDetailQuery(entity, localization);
      const expectedQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?abstract
WHERE {

    <http://dbpedia.org/resource/Category:Programming_languages> dbo:abstract ?abstract.
    FILTER (lang(?abstract) = "en")
    
}
`;
      expect(query.buildQuery()).toEqual(expectedQuery.trim());
    });
  });
});
