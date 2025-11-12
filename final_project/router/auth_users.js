const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (exists in users array)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
 const { username, password } = req.body;

  // Validate username and password presence
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists and credentials match
  if (authenticatedUser(username, password)) {
    // Create JWT token
    const token = jwt.sign({ username: username }, "access", { expiresIn: "1h" });

    // Save token and username in session
    req.session.authorization = {
      accessToken: token,
      username: username
    };

    return res.status(200).json({ message: "User successfully logged in", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // review comes from query string
    const username = req.session.authorization?.username; // get logged-in username
  
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required" });
    }
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Add or update the review for this user
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: `Review added/updated successfully for ISBN ${isbn}`,
      reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username; // logged-in username
  
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the book has reviews and the user has a review
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }
  
    // Delete the user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: `Review deleted successfully for ISBN ${isbn}`,
      reviews: books[isbn].reviews
    });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
