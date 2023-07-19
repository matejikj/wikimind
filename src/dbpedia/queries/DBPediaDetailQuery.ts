import { LanguageLocalization } from "../../models/UserSession";
import { DBpediaQueryBuilder } from "../DBPediaQueryBuilder";

export class DBPediaDetailQuery extends DBpediaQueryBuilder {
  constructor(entity: string, localization: LanguageLocalization) {
    super();
    this.addPrefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
    this.addSelectVariable('abstract');
    let whereClause = `
    <${entity}> dbo:abstract ?abstract.
    `
    localization === LanguageLocalization.CS ?
      whereClause += `FILTER (lang(?abstract) = "cs" || lang(?abstract) = "en")
    ` :
      whereClause += `FILTER (lang(?abstract) = "en")
    `
    this.addWhereClause(whereClause);
  }
}
