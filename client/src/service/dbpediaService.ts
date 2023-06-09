import axios from "axios";
import { Result } from "../models/Result";
import { Binding } from "../models/Binding";

export async function getSingleReccomends(entity: string) {

    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?p (COUNT(?p) AS ?count)
    WHERE {
        {
            <http://dbpedia.org/resource/${entity}> dbo:wikiPageWikiLink ?a.
            <http://dbpedia.org/resource/${entity}> dcterms:subject ?c.
            ?a dbo:wikiPageWikiLink ?p.
            ?p dcterms:subject ?c.
        }
    }
    GROUP BY ?p
    ORDER BY DESC(COUNT(?p))
    LIMIT 50
`;

    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        axios.get(queryUrl).then(async (response) => {

            const result: Result = response.data;
            const entities = result.results.bindings.map((item: Binding) => {
                return item.p.value
            })
            return entities;

        });
    } catch (error) {
        console.log(error);
    }
}

export async function getCategoryInfo(entity: string) {

    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?p (COUNT(?p) AS ?count)
    WHERE {
        {
            <http://dbpedia.org/resource/${entity}> dbo:wikiPageWikiLink ?a.
            <http://dbpedia.org/resource/${entity}> dcterms:subject ?c.
            ?a dbo:wikiPageWikiLink ?p.
            ?p dcterms:subject ?c.
        }
    }
    GROUP BY ?p
    ORDER BY DESC(COUNT(?p))
    LIMIT 50
`;

    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        axios.get(queryUrl).then(async (response) => {

            const result: Result = response.data;
            const entities = result.results.bindings.map((item: Binding) => {
                return item.p.value
            })
            return entities;

        });
    } catch (error) {
        console.log(error);
    }
}