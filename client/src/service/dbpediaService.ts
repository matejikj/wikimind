import axios from "axios";
import { ResultItem } from "../models/ResultItem";
import { Node } from "../models/types/Node";
import { HistoryResultItem } from "../models/HistoryResultItem";

/**
 * Retrieves recommended entities based on a given entity.
 *
 * @param entity - The entity for which to retrieve recommendations.
 * @returns A Promise that resolves to an array of ResultItem objects representing the recommended entities.
 */
export async function getSingleReccomends(entity: string): Promise<ResultItem[] | undefined> {
    const sparqlQuery = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dbo: <http://dbpedia.org/ontology/>
  
      SELECT ?entity (COUNT(?entity) AS ?type) ?label
      WHERE {
          {
              <${entity}> dbo:wikiPageWikiLink ?a.
              <${entity}> dcterms:subject ?c.
              ?a dbo:wikiPageWikiLink ?entity.
              ?entity dcterms:subject ?c.
              ?entity rdfs:label ?label .
              FILTER(LANG(?label) = "en")
          }
      }
      GROUP BY ?entity ?label
      ORDER BY DESC(COUNT(?entity))
      LIMIT 50
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

/**
 * Retrieves labels for a list of ResultItem entities.
 *
 * @param list - The list of entities for which to retrieve labels.
 * @returns A Promise that resolves to an array of ResultItem objects representing the labeled entities.
 */
export async function getLabels(list: ResultItem[]): Promise<ResultItem[] | undefined> {
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

/**
 * Retrieves labels for a list of ResultItem entities.
 *
 * @param list - The list of entities for which to retrieve labels.
 * @returns A Promise that resolves to an array of ResultItem objects representing the labeled entities.
 */
export async function getDates(list: Node[]): Promise<HistoryResultItem[] | undefined> {
    let query = '';
    list.forEach((item) => {
        if (item.uri !== "") {
            query = query + '<' + item.uri + '> ';
        }
    });

    const sparqlQuery = `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
      SELECT DISTINCT ?entity ?label ?propertyLabel ?value ?abstract
      WHERE {
          VALUES ?entity { ${query}}
          ?entity ?property ?value .
          FILTER( contains( str(?property), "Date" ) || contains( str(?property), "date" ) || datatype(?value) = xsd:date)
          OPTIONAL { ?property rdfs:label ?propertyLabel. }
          FILTER (lang(?propertyLabel) = 'en')
          ?entity rdfs:label ?label .
          FILTER(LANG(?label) = "en")
          ?entity dbo:abstract ?abstract
          FILTER(LANG(?abstract) = "en")
      }
    `;

    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        const response: HistoryResultItem[] = (await axios.get(queryUrl)).data.results.bindings;
        return response;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Retrieves the neighbors of a given entity.
 *
 * @param entity - The entity for which to retrieve neighbors.
 * @returns A Promise that resolves to an array of ResultItem objects representing the neighboring entities.
 */
export async function getEntityNeighbours(entity: string): Promise<ResultItem[] | undefined> {
    const sparqlQuery = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
      SELECT ?entity ?type ?label
      WHERE {
          {
              <${entity}> ?type ?entity.
              ?entity rdfs:label ?label.
              FILTER (lang(?label) = "cs" || lang(?label) = "en")
              FILTER (?type = dbo:wikiPageWikiLink || ?type = dcterms:subject)
          }
      }
    `;

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

/**
 * Retrieves entities connected to two given entities.
 *
 * @param entityLeft - The left entity in the connection.
 * @param entityRight - The right entity in the connection.
 * @returns A Promise that resolves to an array of ResultItem objects representing the connected entities.
 */
export async function getEntitiesConnection(
    entityLeft: string,
    entityRight: string
): Promise<ResultItem[] | undefined> {
    const sparqlQuery = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
      SELECT DISTINCT ?entity <> as ?type ?label
      WHERE {
          {
              <${entityLeft}> ?entity <${entityRight}>.
              ?entity rdfs:label ?label.
              FILTER (lang(?label) = "cs" || lang(?label) = "en")
          }
          UNION
          {
              <${entityLeft}> ?type ?entity.
              ?entity ?b <${entityRight}>.
              ?entity rdfs:label ?label.
              FILTER (lang(?label) = "en")
          }
      }
    `;

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

/**
 * Retrieves the description of a given entity.
 *
 * @param entity - The entity for which to retrieve the description.
 * @returns A Promise that resolves to an array of ResultItem objects representing the entity description.
 */
export async function getEntityDescription(entity: string): Promise<ResultItem[] | undefined> {
    const sparqlQuery = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
      SELECT <${entity}> as ?entity ?type ?label
      WHERE {
          {
              <${entity}> ?type ?label.
              FILTER (lang(?label) = "cs" || lang(?label) = "en")
              FILTER (?type = rdfs:comment)
          }
      }
    `;

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

/**
 * Retrieves keywords related to a given entity.
 *
 * @param entity - The entity for which to retrieve keywords.
 * @returns A Promise that resolves to an array of ResultItem objects representing the keywords.
 */
export async function getKeywords(entity: string): Promise<ResultItem[] | undefined> {
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
        .slice(0, 100)
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
    const csLabels = await getLabels(res);
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
    return res;
}
