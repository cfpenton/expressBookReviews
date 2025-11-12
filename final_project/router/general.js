const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    let userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username: username, password: password });
    return res.status(201).json({ message: "User registered successfully" });
});

//task 1
/* public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
}); */

//task 10
public_users.get('/', async function (req, res) {
    try {
        const booksData = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(books);
            }, 1000);
        });
        return res.status(200).json(booksData);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN
//task 2
/* public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
}); */

//task 11
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const bookData = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            }, 1000);
        });

        return res.status(200).json(bookData);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Get book details based on author
//task3
/* public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const authorBooks = [];
    bookKeys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            authorBooks.push({ isbn: key, ...books[key] });
        }
    });

    if (authorBooks.length > 0) {
        return res.status(200).send(JSON.stringify(authorBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
}); */

//task 12
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const results = [];
                for (let isbn in books) {
                    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                        results.push({ isbn, ...books[isbn] });
                    }
                }
                if (results.length > 0) {
                    resolve(results);
                } else {
                    reject("No books found for this author");
                }
            }, 1000);
        });
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


// Get all books based on title
//task 4
/* public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const titleBooks = [];

    bookKeys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            titleBooks.push({ isbn: key, ...books[key] });
        }
    });

    if (titleBooks.length > 0) {
        return res.status(200).send(JSON.stringify(titleBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
}); */

//task 13
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const results = [];
                for (let isbn in books) {
                    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                        results.push({ isbn, ...books[isbn] });
                    }
                }
                if (results.length > 0) {
                    resolve(results);
                } else {
                    reject("No books found with this title");
                }
            }, 1000);
        });
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews || {}, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
