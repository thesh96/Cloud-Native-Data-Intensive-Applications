const Customer = require("../models/customers.model.js");
const kafkaProducer = require("../models/customers.model.kafkaProducer.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400);
        res.body = res.json({"message":"Request body cannot be empty"});
        res.send;
    }
    const customer = new Customer( {
        id : req.body.id,
        userId: req.body.userId,
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
        address2 : req.body.address2,
        city : req.body.city,
        state : req.body.state,
        zipcode : req.body.zipcode
    });
    console.log("Controller");
    Customer.create(customer, (err, data) => {
        if (err) {
            if (err.errType === "missing") {
                console.log("error missing");
                res.status(200);
                res.body = res.json({ "message" : "All fields in the request body are mandatory except address 2", "code" : 400});
                res.send();
            } else if (err.errType === "invalid userId") {
                res.status(200);
                res.body = res.json({ "message" : "userId must be a valid email address", "code" : 400});
                res.send();

            } else if (err.errType === "invalid state") {
                res.status(200);
                res.body = res.json({"message": "state must be a valid 2-letter US state abbreviation", "code" : 400});
                res.send();
            } else if (err.errno == 1062) {
                res.status(200);
                res.body = res.json({ "message": "This user ID already exists in the system", "code" : 422});
                res.send();
            }
        } else {
            console.log("Success");
            res.status(201);
            res.setHeader('Location', '');
            res.body = res.json({ "id" : data.numericId, "userId": customer.userId, "name": customer.name, "phone": customer.phone, "address": customer.address, "address2": customer.address2, "city":customer.city, "state":customer.state, "zipcode":customer.zipcode});
            res.send();
            const message = { "id" : data.numericId, "userId": customer.userId, "name": customer.name, "phone": customer.phone, "address": customer.address, "address2": customer.address2, "city":customer.city, "state":customer.state, "zipcode":customer.zipcode};
            //const message = res.body.userId;
            kafkaProducer.sendMessage(message, result => {
                console.log(result)
            });
        }
    });
};

exports.getByNumericID = (req, res) => {
    Customer.getByNumericId(req.params.id, (err, data) => {
        if (err) {
            if (err.errType === "not found") {
                res.status(200);
                res.body = res.json({"message": "ID does not exist in the system", "code" : 404});
                res.send();
            } else if (err.errType === "id missing") {
                res.status(200);
                res.body = res.json({"message": "Search ID is missing in the request", "code" : 400});
                res.send();
            } else if (err.errType == "illegal id") {
                res.status(200);
                res.body = res.json({"message": "Search ID is not a valid number", "code" : 400});
                res.send();
            } else {
                res.status(200);
                res.body = res.json({"message": "Error retrieving customer with ID " + req.params.id, "code" : 500 });
            }
        } else {
            console.log("Success");
            res.status(200);
            res.setHeader('Location', '');
            res.send(data);
        }
    });
};

exports.getByUserID = (req, res) => {
    Customer.getByUserID(req.query.userId, (err, data) => {
        if (err) {
            if (err.errType === "not found") {
                res.status(200);
                res.body = res.json({"message": "ID does not exist in the system", "code" : 404});
                res.send();
            } else if (err.errType === "userId missing") {
                res.status(200);
                res.body = res.json({"message": "Search ID is missing in the request", "code" : 400});
                res.send();
            } else if (err.errType == "invalid userId") {
                res.status(200);
                res.body = res.json({"message": "Search ID is not a valid email address", "code" : 400});
                res.send();
            } else {
                res.status(200);
                res.body = res.json({"message": "Error retrieving customer with ID " + req.params.id, "code" : 500 });
            }
        } else {
            console.log("Success");
            res.status(200);
            res.setHeader('Location', '');
            res.send(data);
        }
    });
};