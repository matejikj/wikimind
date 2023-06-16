import axios from "axios";
import { Result } from "../models/Result";
import { Binding } from "../models/Binding";
import { ResultItem, SparqlResults } from "../models/SparqlResults";

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
                return item.entity.value
            })
            return entities;

        });
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
        // if (csLabels !== undefined) {
        //     csLabels.forEach((item) => {
        //         dict.set(item.entity.value, item.label.value)
        //     })
        // }
        // res.forEach((item) => {
        //     const newLabel = dict.get(item.entity.value)
        //     if (newLabel !== undefined) {
        //         item.label.value = newLabel
        //         item.label["xml:lang"] = 'cs'
        //     }
        // })


        // const result: SparqlResults = response.data;
        return response;
    } catch (error) {
        console.log(error);
    }
}

// export async function getEntityDetail(entity: string) {

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
//                     entities.push(item.a.value)
//                 }
//             })
//         });
//         return entities;
//     } catch (error) {
//         console.log(error);
//     }
// }