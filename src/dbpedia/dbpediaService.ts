import axios from "axios";
import { LanguageLocalization, UserSession } from "../models/UserSession";
import { Node } from "../models/types/Node";
import { AbstractResultItem } from "./models/AbstractResultItem";
import { RecommendResultItem } from "./models/RecommendResultItem";
import { TimelineResultItem } from "./models/TimelineResultItem";
import { DBpediaCategoryQuery } from "./queries/DBPediaCategoryQuery";
import { DBPediaDetailQuery } from "./queries/DBPediaDetailQuery";
import { DBPediaEntityQuery } from "./queries/DBPediaEntityQuery";
import { DBPediaTimelineQuery } from "./queries/DBPediaTimelineQuery";

export const CATEGORY_PART = "/Category:"

/**
 * Provides methods to interact with the DBpedia dataset and retrieve information.
 */
export class DBPediaService {

    private userSession: UserSession;

    /**
     * Constructs a new instance of the DBPediaService class.
     * @param userSession - The user session containing user-specific information.
     */
    constructor(userSession: UserSession) {
        this.userSession = userSession
    }

    /**
     * Retrieves entity recommendations based on the provided name.
     * @param name - The name of the entity to retrieve recommendations for.
     * @returns A Promise that resolves to an array of RecommendResultItem objects representing the recommendations.
     */
    async getEntityRecommendation(name: string): Promise<RecommendResultItem[] | undefined> {

        let sparqlQuery: string
        name.includes(CATEGORY_PART) ?
            sparqlQuery = new DBpediaCategoryQuery(name, this.userSession.localization).buildQuery() :
            sparqlQuery = new DBPediaEntityQuery(name, this.userSession.localization).buildQuery()


        const endpointUrl = 'https://dbpedia.org/sparql';
        const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
        try {
            const response: RecommendResultItem[] = (await axios.get(queryUrl)).data.results.bindings;

            if (this.userSession.localization === LanguageLocalization.CS) {
                this.filterResultItemList(response)
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Filters the history timeline result item list based on user session localization.
     * @param response - The timeline result item list to be filtered.
     * @private
     */
    private filterHistoryResultItemList(response: TimelineResultItem[]): void {
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

    /**
     * Filters the recommendation result item list based on user session localization.
     * @param response - The recommendation result item list to be filtered.
     * @private
     */
    private filterResultItemList(response: RecommendResultItem[]): void {
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
     * Retrieves details of a recommended item.
     * @param item - The item for which to retrieve details.
     * @returns A Promise that resolves to a string representing the details of the recommended item.
     */
    async getRecommendDetail(item: RecommendResultItem): Promise<string> {
        let res: string = ""

        const sparqlQuery = new DBPediaDetailQuery(item.entity.value, this.userSession.localization).buildQuery()

        const endpointUrl = 'https://dbpedia.org/sparql';
        const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
        try {
            let response: AbstractResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
            if (this.userSession.localization === LanguageLocalization.CS && response.length > 1) {
                const czechAbstract = response.find((item) => item.abstract["xml:lang"] === 'cs')?.abstract.value
                if (czechAbstract) {
                    res = czechAbstract
                }
            } else {
                if (response.length > 0) {
                    res = response[0].abstract.value
                }
            }
            return res

        } catch (error) {
            return res
        }
    }

    /**
     * Retrieves timeline data for a list of nodes.
     * @param list - The list of nodes for which to retrieve timeline data.
     * @returns A Promise that resolves to an array of TimelineResultItem objects representing the timeline data.
     */
    async getDates(list: Node[]): Promise<TimelineResultItem[] | undefined> {
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
            let response: TimelineResultItem[] = (await axios.get(queryUrl)).data.results.bindings;

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
     * @param entity - The entity for which to retrieve keywords.
     * @returns A Promise that resolves to an array of RecommendResultItem objects representing the keywords.
     */
    async getKeywords(entity: string): Promise<RecommendResultItem[] | undefined> {
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

        const res: RecommendResultItem[] = response.data.docs
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

    /**
     * Retrieves labels for a list of ResultItem entities.
     * @param list - The list of entities for which to retrieve labels.
     * @returns A Promise that resolves to an array of ResultItem objects representing the labeled entities.
     * @private
     */
    private async getLabels(list: RecommendResultItem[]): Promise<RecommendResultItem[] | undefined> {
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
            const response: RecommendResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}
