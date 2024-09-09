import bodyParser from 'body-parser';
import express from 'express';
import { JsonDB, Config } from 'node-json-db';

const PORT = 5000;

const db = new JsonDB(new Config('db', true, false, '/'))
const app = express();

app.use(bodyParser.json())

app.get('/recipes', async (req, res) => {
    const data = await db.getData('/')
    res.send(data)
})

app.get('/recipes/:number', async (req, res) => {
    const data = await db.getData(`/recipes[${req.params.number}]`)
    res.send(data)
})

app.post('/recipes', async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    console.log(req.body.meal)

    await db.push('/recipes[]', {
        id: await db.count('/recipes'),
        meal: req.body.meal,
        image: req.body.image,
        ingredients: req.body.ingredients,
        measurements: req.body.measurements,
        instructions: req.body.instructions,
    }, true)

    res.send('Data saved!')
})

app.delete('/recipes/:number', async (req, res) => {
    if (!req.params) return  res.sendStatus(400);
    console.log(req.params)
    await db.delete(`/recipes[${req.params.number}]`)
    res.send('Data deleted!')
})


app.listen(PORT, () => {
    console.log(`Server running in PORT: ${PORT}`)
})