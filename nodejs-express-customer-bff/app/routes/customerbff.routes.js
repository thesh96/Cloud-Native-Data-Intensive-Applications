module.exports = app => {
    const customerbff = require("../controllers/customerbff.controller.js");
    var router = require("express").Router();
    router.post("/customers/", customerbff.create);
    router.get("/customers/:id", customerbff.retrieveByNumericID);
    router.get("/customers/", customerbff.retrieveByUserID);
    app.use('/', router);
};