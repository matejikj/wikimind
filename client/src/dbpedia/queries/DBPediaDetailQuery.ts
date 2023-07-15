import { DBpediaQueryBuilder } from "../DBPediaQueryBuilder";

export class DBPediaDetailQuery  extends DBpediaQueryBuilder {
    constructor(entity: string) {
      super();
      this.addPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
      this.addPrefix('dbo', 'http://dbpedia.org/ontology/');
      this.addPrefix('dcterms', 'http://purl.org/dc/terms/');
      this.addPrefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
      this.addSelectVariable('entity');
      this.addSelectVariable('type');
      this.addSelectVariable('label');
      this.addWhereClause(`{
        <${entity}> ?type ?entity.
        ?entity rdfs:label ?label.
        FILTER (lang(?label) = "cs" || lang(?label) = "en")
      }`);
    }
  }
  