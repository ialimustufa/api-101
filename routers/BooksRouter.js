const express = require('express');
const random = require('random');

const {
    BookSchemas: {
        deleteBookFromID,
        getBookFromID,
        postBook,
        putBook
    },
    allCommonFlush,
    globalValidator
} = require('../tools/validationSchemas');

let {
    books,
    defaultBooks
} = require('../tools/data');
const postgres = require('../tools/postgres');


const app = express.Router();


app.all('/flush',
    allCommonFlush.schemaCheck,
    allCommonFlush.validator,
    async (_, res, next) => {
        try {
            await postgres.flush.book();
            res.send("Books Flushed");
        } catch (error) {
            console.log({ path: './books/flush', error});
            return next(error);
        }
});

app.get('/view', async (req, res, next) => {
    try {
        const data = await postgres.getAll.book();
        res.render('render', {
            cache: false,
            data,
            type: 'books'
        });
    } catch (error) {
        return next(error);
    }
});

app.get('/', async (req, res) => {
    const book = await postgres.get_random.book();
    res.send(book);
});

app.get('/:id',
    getBookFromID,
    globalValidator,
    async (req, res, next) => {
        try {
            if (parseInt(req.params.id, 10) || parseInt(req.params.id, 10) >= 0) {
            const [book] = await postgres.getById.book(parseInt(req.params.id, 10));
    
            if (!book) {
                res.status(404).send("Book not found");
            }
            res.send(book);
        } else {
            res.status(400).send('"ID is missing or invalid"');
        }
        } catch (error) {
            return next(error);
        }
    });

// All the Delete Paths

app.delete('/', (req, res) => {
    res.status(400).send('"ID is missing"');
});


app.delete('/:id',
    deleteBookFromID,
    globalValidator,
    async (req, res, next) => {
        try {
            if (parseInt(req.params.id, 10) || parseInt(req.params.id, 10) >= 0) {
                const { rowCount } = await postgres.delete.book(parseInt(req.params.id, 10));
                if (rowCount) {
                    res.send(`Book with id ${parseInt(req.params.id, 10)} is deleted.`)
                    return;
                }
                const [is_default] = await postgres.getIsDefaultById.book(parseInt(req.params.id, 10));
                if (is_default) {
                    res.status(400).send(`Book with id ${parseInt(req.params.id, 10)} cannot be deleted`);
                    return;
                }
                res.status(404).send(`Book with id ${parseInt(req.params.id, 10)} does not exist, please recheck the ID`);
        } else {
            res.status(400).send('"ID is missing or invalid"');
        }
        } catch (error) {
            return next(error);
        }
    });

//All the post Paths

app.post('/',
    postBook,
    globalValidator,
    async (req, res, next) => {
        try {
            let {
                author,
                book_name,
                link
            } = req.body;
            if (author && book_name) {
                const fetchedBook = await postgres.create.insertBook(author, book_name, link);
                res.status(201).send(Object.assign({}, req.body, { id: fetchedBook.id }));
            } else {
                res.status(400).send((!author) ? `Author not sent` : (!book_name) ? `book_name parameter not sent` : `Invalid request Please recheck`);
            }
        } catch (error) {
            return next(error);
        }
    });

app.put('/',
    putBook,
    globalValidator,
    async (req, res, next) => {
    try {
        let {
            id,
            author,
            book_name,
            link
        } = req.body;
        if (id && author && book_name) {
            const fetchedBook = await postgres.update.book(id, author, book_name, link);
            if (fetchedBook) {
                res.status(204).send({
                    id,
                    author,
                    book_name,
                    source
                } = fetchedBook);
                return;
            }
            const [{ is_default }] = await postgres.getById.book(parseInt(req.params.id, 10));
            if (is_default) {
                res.status(400).send(`Book with id ${parseInt(req.params.id, 10)} cannot be deleted`);
                return;
            }
            res.status(404).send(`Book with id ${parseInt(req.params.id, 10)} does not exist, please recheck the ID`);
        } else {
            res.status(400).send((!id) ? `ID not passed` : (!author) ? `Author not sent` : (!book_name) ? `book_name parameter not sent` : `Invalid request Please recheck`);
        }
    } catch (error) {
        return next(error);
    }
});


module.exports = app;