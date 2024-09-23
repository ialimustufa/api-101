const express = require('express');
const postgres = require('../tools/postgres');


const {
    JokeSchemas: {
        getJokeFromID,
        deleteJokeFromID,
        postJoke,
        putJoke
    },
    allCommonFlush,
    globalValidator
} = require('../tools/validationSchemas');
const {
    checkSchema,
    validationResult
} = require('express-validator');


const app = express.Router();

app.all('/flush',
allCommonFlush.schemaCheck,
allCommonFlush.validator,
async (_, res, next) => {
    try {
        await postgres.flush.joke();
        res.send("Jokes Flushed");
    } catch (error) {
        console.log({ path: './books/flush', error});
        return next(error);
    }
});

app.get('/view', async (req, res, next) => {
    try {
        const data = await postgres.getAll.joke();
        res.render('render', {
            cache: false,
            data,
            type: 'jokes'
        });
    } catch (error) {
        console.log({ path: './jokes/view', error });
        return next(error);
    }
});

app.get('/', async (req, res) => {
    let [joke] = await postgres.get_random.joke();
    res.send(joke);
});

app.get('/:id',
    getJokeFromID, 
    globalValidator,
    async (req, res) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            res.status(400).send(results.array({
                onlyFirstError: true
            }));
            return;
        }
        let joke;
        try {
            joke = await postgres.getById.joke(parseInt(req.params.id, 10));
            if (joke && joke.length) {
                res.send(joke);
            } else {
                res.status(404).send("Joke not found");
            }
        } catch (err) {
            console.log('\n\n==================================');
            console.log("Error in Getting a joke with ID: ", parseInt(req.params.id, 10));
            console.log({ error: err });
            console.log('\n==================================');

            res.status(500).send("Some error ocurred in DB");
        }
    });

app.delete('/', (req, res) => {
    res.status(400).send('"ID is missing or invalid"');
});

app.delete('/:id',
    deleteJokeFromID, 
    globalValidator,
    async (req, res, next) => {
        try {
            if (parseInt(req.params.id, 10) || parseInt(req.params.id, 10) >= 0) {
                const { rowCount } = await postgres.delete.joke(parseInt(req.params.id, 10));
                if (rowCount) {
                    res.send(`Joke with id ${parseInt(req.params.id, 10)} is deleted.`)
                    return;
                }
                const [is_default] = await postgres.getIsDefaultById.joke(parseInt(req.params.id, 10));
                if (is_default) {
                    res.status(400).send(`Joke with id ${parseInt(req.params.id, 10)} cannot be deleted`);
                    return;
                }
                res.status(404).send(`Joke with id ${parseInt(req.params.id, 10)} does not exist, please recheck the ID`);
        } else {
            res.status(400).send('"ID is missing or invalid"');
        }
        } catch (error) {
            return next(error);
        }
    });

app.post('/',
    postJoke,
    globalValidator,
    async (req, res, next) => {
        try {
            let {
                author,
                joke,
                source
            } = req.body;
            if (author && joke) {
                const fetchedJoke = await postgres.create.insertJoke(author, joke, source ?? '');
                res.status(201).send(Object.assign({}, req.body, { id: fetchedJoke.id }));
            } else {
                res.status(400).send((!author) ? `Author not sent` : (!joke) ? `Joke parameter not sent` : `Invalid request Please recheck`);
            }
        } catch (error) {
            return next(error);
        }
    });

app.put('/', 
    putJoke, 
    globalValidator,
    async (req, res, next) => {
    try {
        let {
            id,
            author,
            joke,
            source
        } = req.body;
        if (id && author && joke) {
            const fetchedJoke = await postgres.update.joke(id, author, joke, source ?? '');
            if (fetchedJoke) {
                res.status(204).send({
                    id,
                    author,
                    joke,
                    source
                } = fetchedJoke);
                return;
            }
            const [{ is_default }] = await postgres.getById.joke(parseInt(req.params.id, 10));
            if (is_default) {
                res.status(400).send(`Joke with id ${parseInt(req.params.id, 10)} cannot be deleted`);
                return;
            }
            res.status(404).send(`Joke with id ${parseInt(req.params.id, 10)} does not exist, please recheck the ID`);
        } else {
            res.status(400).send((!id) ? `ID not passed` : (!author) ? `Author not sent` : (!joke) ? `Joke parameter not sent` : `Invalid request Please recheck`);
        }
    } catch (error) {
        return next(error);
    }
});

module.exports = app;