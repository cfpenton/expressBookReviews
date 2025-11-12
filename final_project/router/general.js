const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const { username, password } = req.body; // get username and password from request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  let userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username: username, password: password });
  
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return all the books as a JSON string
  return res.status(200).send(JSON.stringify(books, null, 4));
/*   return res.status(300).json({message: "Yet to be implemented"}); */
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book exists
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // get author from URL
  const bookKeys = Object.keys(books); // get all book keys
  const authorBooks = [];

  // Iterate through all books and find matches
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
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 const title = req.params.title; // get title from URL
  const bookKeys = Object.keys(books); // get all book keys
  const titleBooks = [];

  // Iterate through all books and find matches
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
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 const isbn = req.params.isbn; // get ISBN from URL

  // Check if the book exists
  if (books[isbn]) {
    // Return only the reviews of the book
    return res.status(200).send(JSON.stringify(books[isbn].reviews || {}, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
