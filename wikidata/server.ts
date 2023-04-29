import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

app.get('/entity', async (req, res) => {

    const name = req.query.name;
    const sparqlQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?person ?name WHERE {
        ?person a dbo:Person .
        ?person foaf:name ?name .
        FILTER regex(?name, "${name}")
    }
  `;
    const endpointUrl = 'https://dbpedia.org/sparql';
    const queryUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';
    console.log(queryUrl)
    try {
        const response = await axios.get(queryUrl);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving entity from DBpedia');
    }
});

app.get('/', (req: Request, res: Response) => {
    res.json('Hello, dsd!');
});

app.listen(3006, () => {
    console.log('Server listening on port 3006');
});