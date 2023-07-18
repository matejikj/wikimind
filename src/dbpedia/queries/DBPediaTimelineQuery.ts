import { LanguageLocalization } from "../../models/UserSession";
import { DBpediaQueryBuilder } from "../DBPediaQueryBuilder";

export class DBPediaTimelineQuery extends DBpediaQueryBuilder {
    constructor(query: string, localization: LanguageLocalization) {
      super();
      this.addPrefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
      this.addSelectVariable('entity');
      this.addSelectVariable('label');
      this.addSelectVariable('propertyLabel');
      this.addSelectVariable('value');
      this.addSelectVariable('abstract');
      this.addSelectVariable('thumbnail');
      let whereClause = `VALUES ?entity { ${query}}
      ?entity ?property ?value .
      ?entity dbo:thumbnail ?thumbnail .
      FILTER( contains( str(?property), "Date" ) || contains( str(?property), "date" ) || datatype(?value) = xsd:date)
      OPTIONAL { ?property rdfs:label ?propertyLabel. }
      FILTER (lang(?propertyLabel) = 'en')
      ?entity rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      ?entity dbo:abstract ?abstract
      `
      localization === LanguageLocalization.CS ?
      whereClause += `
      FILTER (lang(?abstract) = "cs" || lang(?abstract) = "en")
      ` :
      whereClause += `
      FILTER (lang(?abstract) = "en")
      `
      this.addWhereClause(whereClause);
    }
  }
  