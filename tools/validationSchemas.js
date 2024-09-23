const { checkSchema, validationResult } = require('express-validator');

// TODO: 
// - Add schema for /flush
// - Add schema for Admin


const BookSchemas = {
    'getBookFromID': checkSchema({
        "id": {
            in: ["params"],
            notEmpty: true,
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        }
    }),
    'deleteBookFromID': checkSchema({
        "id": {
            in: ["params"],
            notEmpty: true,
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        }
    }),
    'postBook': checkSchema({
        "author": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Author not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Author"',
                options: {
                    min: 1
                }
            },
            trim: true
        },
        "book_name": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Book not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Book name"',
                options: {
                    min: 3,
                }
            },
            trim: true
        },
        "link": {
            in: ["body"],
            optional: {
                options: {
                    nullable: true
                }
            }
        }
    }),
    'putBook':checkSchema({
        "id": {
            in: ["body"],
            notEmpty: {
                errorMessage: `ID not sent`
            },
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        },
        "author": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Author not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Author"',
                options: {
                    min: 1
                }
            },
            trim: true
        },
        "book_name": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Book not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Book name"',
                options: {
                    min: 3,
                }
            },
            trim: true
        },
        "link": {
            in: ["body"],
            optional: {
                options: {
                    nullable: true
                }
            }
        }
    })
};

const JokeSchemas = {
    'getJokeFromID': checkSchema({
        "id": {
            in: ["params"],
            notEmpty: true,
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        }
    }),
    'deleteJokeFromID': checkSchema({
        "id": {
            in: ["params"],
            notEmpty: true,
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        }
    }),
    'postJoke': checkSchema({
        "author": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Author not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Author"',
                options: {
                    min: 1
                }
            },
            trim: true
        },
        "joke": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Joke not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Joke"',
                options: {
                    min: 3,
                }
            },
            trim: true
        },
        "source": {
            in: ["body"],
            optional: {
                options: {
                    nullable: true
                }
            }
        }
    }),
    'putJoke': checkSchema({
        "id": {
            in: ["body"],
            notEmpty: {
                errorMessage: `ID not sent`
            },
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        },
        "author": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Author not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Author"',
                options: {
                    min: 1
                }
            },
            trim: true
        },
        "joke": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Joke not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Joke"',
                options: {
                    min: 3,
                }
            },
            trim: true
        },
        "source": {
            in: ["body"],
            optional: {
                options: {
                    nullable: true
                }
            }
        }
    })
};

const QuoteSchemas = {
    'getQuoteFromID': checkSchema({
        "id": {
            in: ["params"],
            notEmpty: true,
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        }
    }),
    'deleteQuoteFromID': checkSchema({
        "id": {
            in: ["params"],
            notEmpty: true,
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        }
    }),
    'postQuote': checkSchema({
        "author": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Author not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Author"',
                options: {
                    min: 1
                }
            },
            trim: true
        },
        "quote": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Quote not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Quote"',
                options: {
                    min: 3,
                }
            },
            trim: true
        },
        "source": {
            in: ["body"],
            optional: {
                options: {
                    nullable: true
                }
            }
        }
    }),
    'putQuote': checkSchema({
        "id": {
            in: ["body"],
            notEmpty: {
                errorMessage: `ID not sent`
            },
            toInt: true,
            isInt: {
                errorMessage: "Invalid ID parameter"
            },
            trim: true
        },
        "author": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Author not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Author"',
                options: {
                    min: 1
                }
            },
            trim: true
        },
        "quote": {
            in: ["body"],
            notEmpty: {
                errorMessage: `"Quote not sent"`
            },
            isLength: {
                errorMessage: '"Invalid length of Quote"',
                options: {
                    min: 3,
                }
            },
            trim: true
        },
        "source": {
            in: ["body"],
            optional: {
                options: {
                    nullable: true
                }
            }
        }
    })
};

const allCommonFlush = {
    schemaCheck: checkSchema({
        'authorization': {
            in: ['header'],
            errorMessage: 'Invalid Authorization Key',
            notEmpty: true,
            isString: true,
            trim: true,
            escape: true,
            equals: process.env.secretKey
        }
    }),
    validator: (req, res, next) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            res.status(401).send("Invalid Authorization Key");
            return;
        }
        if (req.headers.authorization !== process.env.secretKey) {
            res.status(401).send("Invalid Authorization Key");
            return;
        }
        next();
    }
}

const globalValidator = (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        res.status(400).send(results.array({
            onlyFirstError: true
        }));
        return;
    }
    next();
}
module.exports = {
    BookSchemas,
    JokeSchemas,
    QuoteSchemas,
    allCommonFlush,
    globalValidator
};