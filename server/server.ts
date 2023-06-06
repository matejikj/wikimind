import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { Result } from './models/Result';
const app = express();
app.use(cors());

app.get('/entity', async (req, res) => {

    const name = req.query.name;
    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?p (COUNT(?p) AS ?count)
    WHERE {
      {
        <http://dbpedia.org/resource/Bílovice> dbo:wikiPageWikiLink ?p.
      }
      UNION
      {
        <http://dbpedia.org/resource/Topolná> dbo:wikiPageWikiLink ?p.
      }
    }
    GROUP BY ?p
  `;
    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    try {
        axios.get(queryUrl).then((response) => {
            console.log(response.data)

            const result: Result = (response.data);
            const a = result.results.bindings
            res.json(a);
    
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving entity from DBpedia');
    }
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, cfcf!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
