const axios = require('axios');
const jwtDecoder = require('jwt-decode');
const ip = 'http://book-service:3000/books'

exports.create = (req, res) => {

    async function makePostRequest() {
        const resp = await axios.post(ip, req.body);
        const data = resp.data;
        console.log(data);
        if (data.code) {
            const code = data.code;
            delete data.code;
            res.status(code).send(data);
        } else {
            res.status(201).send(data);
        }

    }

    console.log(authorization(req));
    if (!req.headers['user-agent']) {
        res.status(400);
        res.body = res.json({ "message" : "User-Agent not present"});
        res.send();
    }else if (!req.headers['authorization']) {
        res.status(401);
        res.body = res.json({"message": "Authorization not present"});
        res.send();
    } else {
        if (authorization(req)) {
            makePostRequest();
        } else {
            console.log("error: 401");
            res.status(401);
            res.body = res.json({ "message" : "Authorization failed."});
            res.send();
        }
    }
};

exports.modify = (req, res) => {
    async function makePutRequest() {
        const resp = await axios.put(ip + '/' + req.params.id, req.body);
        const data = resp.data;
        console.log(data);
        if (data.code) {
            const code = data.code;
            delete data.code;
            res.status(code).send(data);
        } else {
            res.status(200).send(data);
        }
    }

    console.log(authorization(req));
    if (!req.headers['user-agent']) {
        res.status(400);
        res.body = res.json({ "message" : "User-Agent not present"});
        res.send();
    }else if (!req.headers['authorization']) {
        res.status(401);
        res.body = res.json({"message": "User-Agent not present"});
        res.send();
    } else {
        if (authorization(req)) {
            makePutRequest();
        } else {
            console.log("error: 401");
            res.status(401);
            res.body = res.json({ "message" : "Authorization failed."});
            res.send();
        }
    }
};

exports.retrieve = (req, res) => {
    async function makeGetRequest() {
        const resp = await axios.get(ip + '/' + req.params.id);
        const data = resp.data;
        console.log(data);
        if (data.code) {
            const code = data.code;
            delete data.code;
            res.status(code).send(data);
        } else {
            res.status(200).send(data);
        }

    }

    console.log(authorization(req));
    if (!req.headers['user-agent']) {
        res.status(400);
        res.body = res.json({ "message" : "User-Agent not present"});
        res.send();
    }else if (!req.headers['authorization']) {
        res.status(401);
        res.body = res.json({"message": "User-Agent not present"});
        res.send();
    } else {
        if (authorization(req)) {
            makeGetRequest();
        } else {
            console.log("error: 401");
            res.status(401);
            res.body = res.json({ "message" : "Authorization failed."});
            res.send();
        }
    }
};

exports.retrieveisbn = (req, res) => {
    async function makeGetRequest() {
        const resp = await axios.get(ip + '/isbn/' + req.params.id);
        const data = resp.data;
        if (req.headers["user-agent"].includes("Mobile")) {
            if (data.genre == 'non-fiction') {
                data.genre = 3;
            }
        }
        console.log(data);
        if (data.code) {
            const code = data.code;
            delete data.code;
            res.status(code).send(data);
        } else {
            res.status(200).send(data);
        }
    }

    console.log(authorization(req));
    if (!req.headers['user-agent']) {
        res.status(400);
        res.body = res.json({ "message" : "User-Agent not present"});
        res.send();
    }else if (!req.headers['authorization']) {
        res.status(401);
        res.body = res.json({"message": "User-Agent not present"});
        res.send();
    } else {
        if (authorization(req)) {
            makeGetRequest();
        } else {
            console.log("error: 401");
            res.status(401);
            res.body = res.json({ "message" : "Authorization failed."});
            res.send();
        }
    }
};

function authorization(req) {
    var header = req.headers.authorization;
    console.log(header);
    var encoded = header.split(" ")[1];
    console.log(encoded);
    var decoded = jwtDecoder(encoded);
    console.log(decoded);
    var subs = ["starlord", "gamora", "drax", "rocket", "groot"];
    var exp = new Date(decoded.exp);
    var iss = decoded.iss;
    const today = new Date();
    if (decoded.sub) {
        if (subs.includes(decoded.sub)) {
            console.log("sub pass");
            if (Object.prototype.toString.call(exp) === "[object Date]" && !isNaN(exp) && exp > today) {
                if (iss == "cmu.edu") {
                    return true;
                }
            }
        }
    }
    return false;
}

