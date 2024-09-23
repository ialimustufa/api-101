const { Pool } = require('pg');
const { defaultJokes, defaultQuotes, defaultBooks } = require('./data');


const jokesTable = 'jokes';
const booksTable = 'books';
const quotesTable = 'quotes';


const pool = new Pool(
    {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT ?? 5432),
}
);

const fetchRandomJokes = async () => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, joke, source FROM ${jokesTable} order by random() limit 1;`);
    return rowCount ? rows : [];
}

const fetchRandomBooks = async () => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, book_name, link FROM ${booksTable} order by random() limit 1;`);

    return rowCount ? rows : [];
}

const fetchRandomQuotes = async () => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, quote, source FROM ${quotesTable} order by random() limit 1;`);

    return rowCount ? rows : [];
}

const fetchAllJokes = async () => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, joke, source FROM ${jokesTable};`);
    return rowCount ? rows : [];
}

const fetchAllBooks = async () => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, book_name, link FROM ${booksTable};`);

    return rowCount ? rows : [];
}

const fetchAllQuotes = async () => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, quote, source FROM ${quotesTable};`);

    return rowCount ? rows : [];
}

const fetchJokeById = async (id) => {
    const { rowCount, rows } = await pool.query(`SELECT id, author, joke, source FROM ${jokesTable} where id = $1;`, [id]);
    return rowCount ? rows : [];
}

const fetchBookById = async (id) => {
    const { rowCount, rows } = await pool.query(`
    SELECT id, author, book_name, link
	FROM  ${booksTable} where id = $1;`, [id]);

    return rowCount ? rows : [];
}

const fetchQuoteById = async (id) => {
    const { rowCount, rows } = await pool.query(`
    SELECT id, author, quote, source
	FROM ${quotesTable} where id = $1;`, [id]);

    return rowCount ? rows : [];
}

const fetchJokeIsDefaultById = async (id) => {
    const { rowCount, rows } = await pool.query(`SELECT is_default FROM ${jokesTable} where id = $1;`, [id]);
    return rowCount ? rows : [];
}

const fetchBookIsDefaultById = async (id) => {
    const { rowCount, rows } = await pool.query(`
    SELECT is_default
	FROM  "${booksTable} where id = $1;`, [id]);

    return rowCount ? rows : [];
}

const fetchQuoteIsDefaultById = async (id) => {
    const { rowCount, rows } = await pool.query(`
    SELECT is_default
	FROM ${quotesTable} where id = $1;`, [id]);

    return rowCount ? rows : [];
}

const insertJoke = async (author, joke, source) => {
    const { rows: [data]} = await pool.query(`INSERT INTO ${jokesTable} (author, joke, source) VALUES ($1, $2, $3) RETURNING *`, [author, joke, source]);
    return data;
};

const insertQuote = async (author, quote, source) => {
    const { rows: [data]} = await pool.query(`INSERT INTO ${quotesTable} (author, quote, source) VALUES ($1, $2, $3) RETURNING *`, [author, quote, source]);
    return data;
};

const insertBook = async (author, book_name, link) => {
    const { rows: [data]} = await pool.query(`INSERT INTO ${booksTable} (author, book_name, link) VALUES ($1, $2, $3) RETURNING *`, [author, book_name, link]);
    return data;
};

const updateJoke = async (id, author, joke, source) => {
    const { rows: [data]} = await pool.query(`UPDATE ${jokesTable} SET author = $1, joke = $2, source = $3 WHERE id = $4 and is_default = FALSE RETURNING *`, [author, joke, source, id]);
    return data;
};

const updateQuote = async (id, author, quote, source) => {
    const { rows: [data]} = await pool.query(`UPDATE ${quotesTable} SET author = $1, quote = $2, source = $3 WHERE id = $4 and is_default = FALSE RETURNING *`, [author, quote, source, id]);
    return data;
};

const updateBook = async (id, author, book_name, link) => {
    const { rows: [data]} = await pool.query(`UPDATE ${booksTable} SET author = $1, book_name = $2, link = $3 WHERE id = $4 and is_default = FALSE RETURNING *`, [author, book_name, link, id]);
    return data;
};


const deleteJokeById = async (id) => {
    return pool.query(`DELETE FROM ${jokesTable} where id = $1 and is_default = FALSE;`, [id]);
}

const deleteBookById = async (id) => {
    return pool.query(`
    DELETE FROM ${booksTable} where id = $1 and is_default = FALSE;`, [id]);
}

const deleteQuoteById = async (id) => {
    return pool.query(`
    DELETE FROM ${quotesTable} where id = $1 and is_default = FALSE;`, [id]);;
}


const flushJoke = async () => {
    await pool.query(`
    DELETE FROM ${jokesTable} where is_default = FALSE;
    `);

    return true;
}

const flushQuote = async () => {
    await pool.query(`
    DELETE FROM ${quotesTable} where is_default = FALSE;
    `);

    return true;
}

const flushBook = async () => {
    await pool.query(`
    DELETE FROM ${booksTable} where is_default = FALSE;
    `);

    return true;
}

const flushAll = async () => {
    await flushBook();
    await flushQuote();
    await flushJoke();

    return true;
}




module.exports = {
    create: {
    insertJoke,
    insertQuote,
    insertBook},
    get_random: {
        book: fetchRandomBooks,
        quote: fetchRandomQuotes,
        joke: fetchRandomJokes,
    },
    getAll: {
        book: fetchAllBooks,
        quote: fetchAllQuotes,
        joke: fetchAllJokes,
    },
    getById: {
        book: fetchBookById,
        quote: fetchQuoteById,
        joke: fetchJokeById,
    },
    getIsDefaultById: {
        book: fetchBookIsDefaultById,
        quote: fetchQuoteIsDefaultById,
        joke: fetchJokeIsDefaultById,
    },
    update: {
        book: updateBook,
        quote: updateQuote,
        joke: updateJoke,
    },
    delete: {
        book: deleteBookById,
        quote: deleteQuoteById,
        joke: deleteJokeById,
    },
    flush: {
        all: flushAll,
        book: flushBook,
        quote: flushQuote,
        joke: flushJoke,
    }
}
