const books = require("../controllers/books.controller");
module.exports = app => {
    const books = require("../controllers/books.controller.js");
    var router = require("express").Router();
    router.post("/books/", books.create);
    router.put("/books/:id", books.update);
    router.get("/books/:id", books.get);
    router.get("/books/isbn/:id", books.get);
    router.get("/books/:ISBN/related-books", books.circuitBreaker);
    app.use('/', router);
};