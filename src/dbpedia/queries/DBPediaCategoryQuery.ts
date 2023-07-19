import { LanguageLocalization } from "../../models/UserSession";
import { DBpediaQueryBuilder } from "../DBPediaQueryBuilder";

export class DBpediaCategoryQuery extends DBpediaQueryBuilder {
  constructor(entity: string, localization: LanguageLocalization) {
    super();
    this.addPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.addPrefix('dbo', 'http://dbpedia.org/ontology/');
    this.addPrefix('dcterms', 'http://purl.org/dc/terms/');
    this.addPrefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
    this.addPrefix('skos', 'http://www.w3.org/2004/02/skos/core#');
    this.addSelectVariable('entity');
    this.addSelectVariable('label');
    let whereClause = `
    {
      <${entity}> ?type ?entity.
      ?entity rdfs:label ?label.
      FILTER (?type = skos:broader || ?type = dcterms:subject)
      `
    localization === LanguageLocalization.CS ?
      whereClause += `FILTER (lang(?label) = "cs" || lang(?label) = "en")
    `:
      whereClause += `FILTER (lang(?label) = "en")
    `
    whereClause += `}
    UNION
    {
      ?entity ?type <${entity}>.
      ?entity rdfs:label ?label.
      FILTER (?type = skos:broader || ?type = dcterms:subject)
      `
    localization === LanguageLocalization.CS ?
      whereClause += `FILTER (lang(?label) = "cs" || lang(?label) = "en")
    }
    `:
      whereClause += `FILTER (lang(?label) = "en")
    }
    `

    this.addWhereClause(whereClause);
  }
}
