const bookbff = require("../controllers/bookbff.controller");
module.exports = app => {
    const bookbff = require("../controllers/bookbff.controller.js");
    var router = require("express").Router();
    router.post("/books/", bookbff.create);
    router.put("/books/:id", bookbff.modify);
    router.get("/books/:id", bookbff.retrieve);
    router.get("/books/isbn/:id", bookbff.retrieveisbn);
    router.get("/books/:id/related-books", bookbff.retrieveisbn);
    app.use('/', router);
};