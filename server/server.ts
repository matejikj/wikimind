import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { Result } from './models/Result';
import { Binding } from './models/Binding';
const app = express();
app.use(cors());

// async function processSimilar(entity: any, queries: string[]): Promise<{ entity: string; count: number; }[] | undefined> {
//     try {
//         const results: { entity: string; count: number; }[] = []
//         const promises = queries.map(async (query: string) => {
//             const sparqlQuery = `
//                 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//                 PREFIX dbo: <http://dbpedia.org/ontology/>
                
//                 SELECT ?p (COUNT(?p) AS ?count)
//                 WHERE {
//                     {
//                         <http://dbpedia.org/resource/${}> dbo:wikiPageWikiLink ?a.
//                         <http://dbpedia.org/resource/Jan_Hus> dcterms:subject ?c.
//                         ?a dbo:wikiPageWikiLink ?p.
//                         ?p dcterms:subject ?c.
//                     }
//                 }
//                 GROUP BY ?p
//                 HAVING (COUNT(?p) > 1)
//                 ORDER BY DESC(COUNT(?p))
//                 LIMIT 50            
//             `;
//             const endpointUrl = 'https://dbpedia.org/sparql';
//             const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';

//             // const response = await axios.get(`https://dbpedia.org/sparql?query=${encodeURIComponent(query)}`);
//             const response = await axios.get(queryUrl);
//             const data: Result = response.data;
//             const res = data.results.bindings.reduce((total: number, item: Binding) => {
//                 if (item.count !== undefined) {
//                     const countValue = parseInt(item.count.value);
//                     if (countValue === 2) {
//                         return total + 1;
//                     }
//                 }
//                 return total;
//             }, 0);
//             results.push({
//                 entity: query,
//                 count: res
//             })
//         });

//         await Promise.all(promises);
//         console.log('All queries processed successfully.');

//         return results
//     } catch (error) {
//         console.error('An error occurred while processing queries:', error);
//     }
// }

app.get('/recommends', async (req, res) => {

    const entity = req.query.entity;
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
            res.json(entities);

        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving entity from DBpedia');
    }
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, cfcf!');
});

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
