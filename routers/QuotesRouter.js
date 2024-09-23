const express = require('express');

const { QuoteSchemas: { deleteQuoteFromID, getQuoteFromID, postQuote, putQuote }, allCommonFlush, globalValidator } = require('../tools/validationSchemas');


const {
    validationResult
} = require('express-validator');

const postgres = require('../tools/postgres');



const app = express.Router();

app.all('/flush',
allCommonFlush.schemaCheck,
allCommonFlush.validator,
    async (_, res, next) => {
        try {
            await postgres.flush.quote();
            res.send("Quotes Flushed");
        } catch (error) {
            return next(error);
        }
});

app.get('/view', async (req, res, next) => {
    try {
        const data = await postgres.getAll.quote();
        res.render('render', {
            cache: false,
            data,
            type: 'quotes'
        });
    } catch (error) {
        return next(error);
    }
});

app.get('/', async (req, res) => {
    const quote = await postgres.get_random.quote();
    res.send(quote);
});

app.get('/:id',
getQuoteFromID,
globalValidator,
async (req, res, next) => {
    try {
        if (parseInt(parseInt(req.params.id, 10), 10) || parseInt(req.params.id, 10) >= 0) {
        const [quote] = await postgres.getById.quote(parseInt(parseInt(req.params.id, 10), 10));

        if (!quote) {
            res.status(404).send("Quote not found");
        }
        res.send(quote);
    } else {
        res.status(400).send('"ID is missing or invalid"');
    }
    } catch (error) {
        return next(error);
    }
});
    
app.delete('/', (req, res) => {
    res.status(400).send('"ID is missing or invalid"');
});

app.delete('/:id',
deleteQuoteFromID,
globalValidator,
async (req, res, next) => {
    try {
        if (parseInt(req.params.id, 10) || parseInt(req.params.id, 10) >= 0) {
            const { rowCount } = await postgres.delete.quote(parseInt(req.params.id, 10));
            if (rowCount) {
                res.send(`Quote with id ${parseInt(req.params.id, 10)} is deleted.`)
                return;
            }
            const [is_default] = await postgres.getIsDefaultById.quote(parseInt(req.params.id, 10));
            if (is_default) {
                res.status(400).send(`Quote with id ${parseInt(req.params.id, 10)} cannot be deleted`);
                return;
            }
            res.status(404).send(`Quote with id ${parseInt(req.params.id, 10)} does not exist, please recheck the ID`);
    } else {
        res.status(400).send('"ID is missing or invalid"');
    }
    } catch (error) {
        return next(error);
    }
});
    
app.post('/',
postQuote,
globalValidator,
async (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        res.status(400).send(results.array({
            onlyFirstError: true
        })[0]);
        return;
    }

    try {
        let {
            author,
            quote,
            source
        } = req.body;
        if (author && quote) {
            const fetchedQuote = await postgres.create.insertQuote(author, quote, source);
            res.status(201).send(Object.assign({}, req.body, { id: fetchedQuote.id }));
        } else {
            res.status(400).send((!author) ? `Author not sent` : (!quote) ? `Quote parameter not sent` : `Invalid request Please recheck`);
        }
    } catch (error) {
        return next(error);
    }
});

app.put('/',
putQuote,
globalValidator,
    async (req, res, next) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            res.status(400).send(results.array({
                onlyFirstError: true
            })[0]);
            return;
        }

    try {
        let {
            id,
            author,
            quote,
            source
        } = req.body;
        if (id && author && quote) {
            const updatedQuote = await postgres.update.quote(id, author, quote, source);
            if (updatedQuote) {
                res.status(204).send({
                    id,
                    author,
                    quote,
                    source
                } = updatedQuote);
                return;
            }
            const [{ is_default }] = await postgres.getById.quote(id);
            if (is_default) {
                res.status(400).send(`Quote with id ${parseInt(req.params.id, 10)} cannot be updated`);
                return;
            }
            res.status(404).send(`Quote with id ${parseInt(req.params.id, 10)} does not exist, please recheck the ID`);
        } else {
            res.status(400).send((!id) ? `ID not passed` : (!author) ? `Author not sent` : (!quote) ? `Quote parameter not sent` : `Invalid request Please recheck`);
        }
    } catch (error) {
        return next(error);
    }
});


module.exports = app;