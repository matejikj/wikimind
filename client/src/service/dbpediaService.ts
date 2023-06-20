import axios from "axios";
import { Result } from "../models/Result";
import { Binding } from "../models/Binding";
import { ResultItem, SparqlResults } from "../models/SparqlResults";

export async function getSingleReccomends(entity: string) {

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
        const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings
        return response;
    } catch (error) {
        console.log(error);
    }
}

// export async function getEntityNeighbours(entity: string) {

//     const sparqlQuery = `
//     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//     PREFIX dbo: <http://dbpedia.org/ontology/>
//     PREFIX dcterms: <http://purl.org/dc/terms/>

//     SELECT ?p ?a
//     WHERE {
//       {
//         <${entity}> ?p ?a.
//         FILTER (?p = dbo:wikiPageWikiLink || ?p = dcterms:subject)
//       }
//     }`;

//     const endpointUrl = 'https://dbpedia.org/sparql';
//     const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
//     try {
//         const entities: any[] = []
//         const b = await axios.get(queryUrl).then((response) => {
//             const result = response.data;
//             result.results.bindings.forEach((item: Binding) => {
//                 if (item.a) {
//                     entities.push({url: item.a.value, type: item.p.value})
//                 }
//             })
//         });
//         return entities;
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function getLabels(list: ResultItem[]) {
    let query = ''

    list.forEach((item) => {
        query = query + '<' + item.entity.value + '> '
    })

    const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?entity rdfs:label as ?type ?label
    WHERE {
        VALUES ?entity { ${query}}
        ?entity rdfs:label ?label .
        FILTER(LANG(?label) = "cs")
    }`;

    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings
        // const result: SparqlResults = response.data;
        return response;
    } catch (error) {
        console.log(error);
    }

}

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
    }`;

    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings
        const dict = new Map<string, boolean>();
        response.forEach((item) => {
            if (item.label["xml:lang"] === 'cs') {
                dict.set(item.entity.value, true)
            }
        })
        for (let i = response.length - 1; i >= 0; i--) {
            if (response[i].label["xml:lang"] === 'en' && dict.has(response[i].entity.value)) {
                response.splice(i, 1)
            }
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getEntityDescription(entity: string) {

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
    }`;

    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        const response: ResultItem[] = (await axios.get(queryUrl)).data.results.bindings
        const dict = new Map<string, boolean>();
        response.forEach((item) => {
            if (item.label["xml:lang"] === 'cs') {
                dict.set(item.entity.value, true)
            }
        })
        for (let i = response.length - 1; i >= 0; i--) {
            if (response[i].label["xml:lang"] === 'en' && dict.has(response[i].entity.value)) {
                response.splice(i, 1)
            }
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getKeywords(entity: string): Promise<ResultItem[] | undefined> {
    const url = "https://lookup.dbpedia.org/api/search?label=" + entity
    const response = await axios.get("https://lookup.dbpedia.org/api/search", {
        params: {
            format: 'json',
            label: entity,
        },
        headers: {
            Accept: 'application/json'
        }
    })
    
    const res: ResultItem[] = response.data.docs.slice(0, 100).map((item: any) => {
        return {
            "entity":
            {
                "type": "uri",
                "value": item.resource[0]
            },
            "type":
            {
                "type": "uri",
                "value": "http://dbpedia.org/ontology/wikiPageWikiLink"
            },
            "label":
            {
                "type": "literal",
                "xml:lang": "en",
                "value": item.label[0].replaceAll('<B>', '').replaceAll('</B>', '')
            }
        }
    })
    const csLabels = await getLabels(res)
    const dict = new Map<string, string>();
    if (csLabels !== undefined) {
        csLabels.forEach((item) => {
            dict.set(item.entity.value, item.label.value)
        })
    }
    res.forEach((item) => {
        const newLabel = dict.get(item.entity.value)
        if (newLabel !== undefined) {
            item.label.value = newLabel
            item.label["xml:lang"] = 'cs'
        }
    })
    return (res)
}
