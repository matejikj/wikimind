import axios from "axios";
import { ResultItem } from "../models/ResultItem";
import { Node } from "../models/types/Node";
import { HistoryResultItem } from "../models/HistoryResultItem";
import { DBPediaEntityQuery } from "./DBPediaEntityQuery";
import { DBPediaTimelineQuery } from "./DBPediaTimelineQuery";
import { DBpediaCategoryQuery } from "./DBPediaCategoryQuery";
import { LanguageLocalization, UserSession } from "../models/types/UserSession";

export class DBPediaService {

    private userSession: UserSession;

    constructor(userSession: UserSession) {
        this.userSession = userSession
    }

    async getEntityRecommendation(name: string): Promise<ResultItem[] | undefined> {
        const sparqlQuery = new DBPediaEntityQuery(name, this.userSession.localization).buildQuery()

        const endpointUrl = 'https://dbpedia.org/sparql';
        const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
        try {
            const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
            
            if (this.userSession.localization === LanguageLocalization.CS) {
                this.filterResultItemList(response)
            }            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getCategoryRecommendation(name: string): Promise<ResultItem[] | undefined> {
        const sparqlQuery = new DBpediaCategoryQuery(name).buildQuery()

        const endpointUrl = 'https://dbpedia.org/sparql';
        const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
        try {
            const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
            const dict = new Map<string, boolean>();
            response.forEach((item) => {
                if (item.label['xml:lang'] === 'cs') {
                    dict.set(item.entity.value, true);
                }
            });
            for (let i = response.length - 1; i >= 0; i--) {
                if (response[i].label['xml:lang'] === 'en' && dict.has(response[i].entity.value)) {
                    response.splice(i, 1);
                }
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    private async getLabels(list: ResultItem[]): Promise<ResultItem[] | undefined> {
        let query = '';
        list.forEach((item) => {
            query = query + '<' + item.entity.value + '> ';
        });

        const sparqlQuery = `
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      
          SELECT ?entity rdfs:label as ?type ?label
          WHERE {
              VALUES ?entity { ${query}}
              ?entity rdfs:label ?label .
              FILTER(LANG(?label) = "cs")
          }
        `;

        const endpointUrl = 'https://dbpedia.org/sparql';
        const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
        try {
            const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    private filterHistoryResultItemList(response: HistoryResultItem[]) {
        const dict = new Map<string, boolean>();
        response.forEach((item) => {
            if (item.abstract['xml:lang'] === 'cs') {
                dict.set(item.entity.value, true);
            }
        });
        for (let i = response.length - 1; i >= 0; i--) {
            if (response[i].abstract['xml:lang'] === 'en' && dict.has(response[i].entity.value)) {
                response.splice(i, 1);
            }
        }
    }

    private filterResultItemList(response: ResultItem[]) {
        const dict = new Map<string, boolean>();
        response.forEach((item) => {
            if (item.label['xml:lang'] === 'cs') {
                dict.set(item.entity.value, true);
            }
        });
        for (let i = response.length - 1; i >= 0; i--) {
            if (response[i].label['xml:lang'] === 'en' && dict.has(response[i].entity.value)) {
                response.splice(i, 1);
            }
        }
    }

    

    /**
     * 
     * Retrieves labels for a list of ResultItem entities.
     *
     * @param list - The list of entities for which to retrieve labels.
     * @returns A Promise that resolves to an array of ResultItem objects representing the labeled entities.
     */
    async getDates(list: Node[]): Promise<HistoryResultItem[] | undefined> {
        let query = '';
        list.forEach((item) => {
            if (item.uri !== "") {
                query = query + '<' + item.uri + '> ';
            }
        });
        const sparqlQuery = new DBPediaTimelineQuery(query, this.userSession.localization).buildQuery()

        const endpointUrl = 'https://dbpedia.org/sparql';
        const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
        try {
            let response: HistoryResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
            
            if (this.userSession.localization === LanguageLocalization.CS) {
                this.filterHistoryResultItemList(response)
            }            

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Retrieves keywords related to a given entity.
     *
     * @param entity - The entity for which to retrieve keywords.
     * @returns A Promise that resolves to an array of ResultItem objects representing the keywords.
     */
    async getKeywords(entity: string): Promise<ResultItem[] | undefined> {
        const url = 'https://lookup.dbpedia.org/api/search?label=' + entity;
        const response = await axios.get('https://lookup.dbpedia.org/api/search', {
            params: {
                format: 'json',
                label: entity,
            },
            headers: {
                Accept: 'application/json',
            },
        });

        const res: ResultItem[] = response.data.docs
            .slice(0, 200)
            .map((item: any) => {
                return {
                    entity: {
                        type: 'uri',
                        value: item.resource[0],
                    },
                    type: {
                        type: 'uri',
                        value: 'http://dbpedia.org/ontology/wikiPageWikiLink',
                    },
                    label: {
                        type: 'literal',
                        'xml:lang': 'en',
                        value: item.label[0].replaceAll('<B>', '').replaceAll('</B>', ''),
                    },
                };
            });
            if (this.userSession.localization === LanguageLocalization.CS) {
                const csLabels = await this.getLabels(res);
                const dict = new Map<string, string>();
                if (csLabels !== undefined) {
                    csLabels.forEach((item) => {
                        dict.set(item.entity.value, item.label.value);
                    });
                }
                res.forEach((item) => {
                    const newLabel = dict.get(item.entity.value);
                    if (newLabel !== undefined) {
                        item.label.value = newLabel;
                        item.label['xml:lang'] = 'cs';
                    }
                });
            }
            
        return res;
    }
}
