'use strict'
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
const express = require('express');
const expressRateLimit = require('express-rate-limit');

const { errorHandlingMiddleware } = require('./tools/functions');
const postgres = require('./tools/postgres');



const app = express();
const morgan = require("morgan");
const random = require('random');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const multer = require('multer')();
const {
    allCommonFlush
} = require('./tools/validationSchemas');

let sessionObject;
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sessionObject = {
        name: 'postmanAPI102',
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: process.env.cookieSecret,
        //set as http only
        // cookie: {
        //     httpOnly: true,
        //     secure: true,
        //     path: '/astronaut/admin',
        //     maxAge: 24 * 60 * 60 * 1000,
        //     sameSite: true
        // },
        // rolling: true,
        // unset: 'destroy'
    };
} else {
    sessionObject = {
        name: 'postmanAPI102',
        resave: true, // don't save session if unmodified
        saveUninitialized: true, // don't create session until something stored if false
        secret: process.env.cookieSecret || 'shhhhhhared-secret'
    };
};
const limiter = expressRateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 50, // Limit each IP to 50 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: true, // Disable the `X-RateLimit-*` headers
})

app.use(compression());
app.use(helmet({
    // add script-src unsafe-inline
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", "*", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "https://cdn.statically.io", "https://img.icons8.com", 'data:'],
        }
    }
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(morgan("dev"));
app.set('view engine', 'ejs');
// app.set('view options');
app.use(session(sessionObject));

// Session-persisted message middleware
app.use(errorHandlingMiddleware);

// Authenticate using our plain-object database of doom!


app.use(multer.none());
// app.use(limiter);

app.get('/', (req, res) => res.send('Hello World!'));

app.all('/flush',
allCommonFlush.schemaCheck,
allCommonFlush.validator,
    async (_, res, next) => {
        try {
            await postgres.flush.all();
            res.send("All Data Flushed");
        } catch (error) {
            return next(error);
        }
});

//All the Get Paths
app.get('/view', async (_, res, next) => {
    try {
        const [jokes, quotes, books] = await Promise.all([postgres.getAll.joke(), postgres.getAll.quote(), postgres.getAll.book()]);

        res.render('renderAll', {
            cache: false,
            data: {
                jokes,
                quotes,
                books
            }
        });
    } catch (error) {
        return next(error);
    }
});

// All the Put Paths

app.use('/astronaut', require('./routers/AdminRouter'));
app.use('/joke', require('./routers/JokesRouter'));
app.use('/quote', require('./routers/QuotesRouter'));
app.use('/book', require('./routers/BooksRouter'));


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
