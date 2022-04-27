const customers = require("../controllers/customers.controller");

module.exports = app => {
    const customers = require("../controllers/customers.controller.js");
    var router = require("express").Router();
    router.post("/customers/", customers.create);
    router.get("/customers/:id", customers.getByNumericID);
    router.get("/customers/", customers.getByUserID);
    app.use('/', router);
};