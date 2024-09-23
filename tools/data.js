const defaultJokes = [{
    "id": 0,
    "author": "NA",
    "joke": "Q: How did the Coder CEO build his company headquarters? A: By calling the Constructor();",
    "source": "https://github.com/shrutikapoor08/devjoke/blob/master/README.md"
},
{
    "id": 1,
    "author": "NA",
    "joke": "Q: What is Hardware? A: The part of the computer which you can kick.",
    "source": "https://github.com/shrutikapoor08/devjoke/blob/master/README.md"
},
{
    "id": 2,
    "author": "NA",
    "joke": "Q: Who is a programmer? A: A programmer is a machine who turns coffee into code.",
    "source": "https://github.com/shrutikapoor08/devjoke/blob/master/README.md"
},
{
    "id": 3,
    "author": "NA",
    "joke": "First rule of programming : If it works DON'T touch it.",
    "source": "https://github.com/shrutikapoor08/devjoke/blob/master/README.md"
}
];
let jokes = defaultJokes;

const defaultQuotes = [{
    "id": 0,
    "author": "James Baldwin",
    "quote": "I cant believe what you say, because I see what you do.",
    "source": "A Report from Occupied Territory"
},
{
    "id": 1,
    "author": "Annie Easley",
    "quote": "If I cant work with you, I will work around you",
    "source": "2001 NASA Interview"
},
{
    "id": 2,
    "author": "Bell Hooks",
    "quote": "It is in the act of having to do things that you don\u2019t want to that you learn something about moving past the self. Past the ego.",
    "source": "Conversation with John Perry Barlow"
},
{
    "id": 3,
    "author": "Ehime Ora",
    "quote": "You worked so hard for this moment. Your new life is finally beginning and you are deserving of all of it.",
    "source": "https://twitter.com/ehimeora/status/1366168809074221056"
}
];
let quotes = defaultQuotes;

const defaultBooks = [{
    "id": 0,
    "author": "Kiyosaki",
    "book_name": "Rich Dad Poor Dad",
    "link": "https://www.richdad.com/"
},
{
    "id": 1,
    "author": "J K Rowling",
    "book_name": "Harry Potter Books",
    "link": "https://www.jkrowling.com/writing/"
},
{
    "id": 2,
    "author": "Sudha Murty",
    "book_name": "Wise And Otherwise",
    "link": "https://g.co/kgs/McRE4o/"
},
{
    "id": 3,
    "author": "Walter Isaacson",
    "book_name": "Steve Jobs",
    "link": "https://g.co/kgs/o8xgGr"
}
];
let books = defaultBooks;

const secret_key = process.env.secretKey;

module.exports = {
    jokes,
    quotes,
    books,
    defaultJokes,
    defaultQuotes,
    defaultBooks,
    secret_key
}