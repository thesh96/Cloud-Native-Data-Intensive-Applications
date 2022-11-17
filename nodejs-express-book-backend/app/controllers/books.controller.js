const Book = require("../models/books.model.js");
const axios = require('axios');
const http = require('http');
axios.defaults.timeout = 60000;
let previousResponse = 200;
let previousTime = Date.now();

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400);
        res.body = res.json({"message":"Request body cannot be empty"});
        res.send;
    }
    const book = new Book({
        ISBN : req.body.ISBN,
        title: req.body.title,
        Author : req.body.Author,
        description : req.body.description,
        genre : req.body.genre,
        price : req.body.price,
        quantity : req.body.quantity
    });
    console.log("Controller");
    Book.create(book, (err, data) => {
        if (err) {
            if (err.errType === "missing") {
                console.log("error missing");
                res.status(200);
                res.body = res.json({ "message" : "All fields in the request body are mandatory", "code": 400});
                res.send();
            } else if (err.errType === "invalid price") {
                res.status(200);
                res.body = res.json({ "message" : "Price must be a valid number with 2 decimal places", "code": 400});
                res.send();

            } else if (err.errno == 1062) {
                res.status(200);
                res.body = res.json({ "message": "This ISBN already exists in the system", "code": 422});
                res.send();
            }
        } else {
            console.log("Success");
            res.status(201);
            res.setHeader('Location', '');
            //res.body = res.json({ "ISBN" : book.ISBN, "title": book.title, "Author": book.Author, "description": book.description, "genre": book.genre, "price": book.price, "quantity":book.quantity});
            res.send({ "ISBN" : book.ISBN, "title": book.title, "Author": book.Author, "description": book.description, "genre": book.genre, "price": book.price, "quantity":book.quantity});
        }
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(200);
        res.body = res.json({"message":"Request body cannot be empty", "code": 400});
        res.send;
    }
    const book = new Book({
        ISBN : req.body.ISBN,
        title: req.body.title,
        Author : req.body.Author,
        description : req.body.description,
        genre : req.body.genre,
        price : req.body.price,
        quantity : req.body.quantity
    });
    Book.update(req.params.id, book, (err, data) => {
        if (err) {
            if (err.errType === "missing") {
                res.status(200);
                res.body = res.json({ "message" : "All fields in the request body are mandatory", "code": 400});
                res.send();
            } else if (err.errType === "invalid price") {
                res.status(200);
                res.body = res.json({"message": "Price must be a valid number with 2 decimal places", "code": 400});
                res.send();
            } else if (err.errType === "not_found") {
                res.status(200);
                res.body = res.json({"message": "ISBN not found", "code": 404});
                res.send();
            } else {
                res.status(400);
                res.body = res.json({"message": "Error updating book with ISBN " + req.params.id , "code": 500});
                res.send();
            }
        } else {
            console.log("Success");
            res.status(200);
            res.setHeader('Location', '');
            res.body = res.json({ "ISBN" : book.ISBN, "title": book.title, "Author": book.Author, "description": book.description, "genre": book.genre, "price": book.price, "quantity":book.quantity});
            res.send();
        }
    });
};

exports.get = (req, res) => {
    Book.get(req.params.id, (err, data) => {
        if (err) {
            if (err.errType === "not found") {
                res.status(200);
                res.body = res.json({"message": "ISBN not found", "code": 404});
                res.send();
            } else {
                res.status(200);
                res.body = res.json({"message": "Error retrieving book with ISBN " + req.params.id, "code": 500 });
                res.send();
            }
        } else {
            console.log("Success");
            res.status(200);
            res.setHeader('Location', '');
            res.send(data);
        }
    });
};

async function circuitBreaker(req, res) {
    let errorMessage = {'message':'Wait for 60 seconds'};
        let currentTime = Date.now();
        let timer = 60 * 1000;
        if (previousResponse == 504 && currentTime < previousTime){
            res.status(503).send(errorMessage);
            console.log('first');
        } else {
            /*const apiCall = await axios
                .get('http://54.164.102.184:80/recommended-titles/isbn/'+req.params.ISBN)
                .then(function(response) {
                    let currentTime = Date.now();
                    let statusSucc = 200;
                    if (response.status == 204){
                        statusSucc = 204;
                    }
                    res.status(statusSucc).send(response.data);
                        previousTime = Date.now();
                    })
                .catch(function(error) {
                    console.log(error);
                    if(error.code == 'ECONNABORTED'){

                        console.log('504');
                        res.status(504).send(errorMessage);
                        previousResponse = 504;
                        previousTime = Date.now() + timer;
                    }
                })
                .then(function(response) {

                });*/
            const options = {
                hostname: '54.164.102.184:80',
                port: 80,
                path: 'recommended-titles/isbn/'+req.params.ISBN,
                method: 'GET',
            };
            const request = http.request(options, response => {

                if (response.statusCode == 204) {
                    res.status(204).send();
                }
                response.on('data', d => {
                res.status(response.statusCode).send(d)});
            });
            request.on('timeout', () => {
                res.status(504).send();
            });
            request.end();
        }
}
module.exports.circuitBreaker = circuitBreaker;


