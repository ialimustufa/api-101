const express = require('express');
const postgres = require('../tools/postgres');


const {
    validationResult
} = require('express-validator');

const {
    authenticate,
    restrict,
} = require('../tools/functions');

const app = express.Router();

app.get('/admin', restrict, async (req, res, next) => {
    try {
        const jokes = await postgres.getAll.joke();
        const quotes = await postgres.getAll.quote();
        const books = await postgres.getAll.book();
    
        res.render('admin-view', {
            cache: false,
            load: req.toLoad,
            data: (req.toLoad === 'admin') ? {
                jokes,
                quotes,
                books
            } : ''
        });
    } catch (error) {
        return next(error);
    }
});

app.post('/login', (req, res) => {
    function callback(err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (user) {
                req.session.regenerate(() => {
                    req.session.user = process.env.passPhrase;
                    req.session.success = "Authenticated";
                    res.redirect('/astronaut/admin');
                });
            } else {
                req.session.err = 'Wrong Password';
                res.redirect('/astronaut/admin');
            }
        }
    }
    const {
        username
    } = Object.assign({}, req.body);
    // console.log(username);
    authenticate(username, callback);
    // res.redirect('/astronaut/admin');
});

module.exports = app;