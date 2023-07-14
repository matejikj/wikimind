import { DBpediaQueryBuilder } from "./DBPediaQueryBuilder";

export class DBpediaCategoryQuery extends DBpediaQueryBuilder {
    constructor(category: string) {
      super();
      this.addPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
      this.addPrefix('dbo', 'http://dbpedia.org/ontology/');
      this.addPrefix('dcterms', 'http://purl.org/dc/terms/');
      this.addPrefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
      this.addPrefix('skos', 'http://www.w3.org/2004/02/skos/core#');
      this.addSelectVariable('entity');
      this.addSelectVariable('type');
      this.addSelectVariable('label');
      this.addWhereClause(`{
        {
            <${category}> ?type ?entity.
            ?entity rdfs:label ?label.
            FILTER (lang(?label) = "cs" || lang(?label) = "en")
            FILTER (?type = skos:broader || ?type = dcterms:subject)
        }
        UNION
        {
            ?entity ?type <${category}>.
            ?entity rdfs:label ?label.
            FILTER (lang(?label) = "cs" || lang(?label) = "en")
            FILTER (?type = skos:broader || ?type = dcterms:subject)
        }
      }`);
    }
  }
  