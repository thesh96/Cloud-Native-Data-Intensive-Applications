const sql = require("./db.js");

const Customers = function(customers) {
    //this.id = customers.id;
    this.userId = customers.userId;
    this.name = customers.name;
    this.phone = customers.phone;
    this.address = customers.address;
    this.address2 = customers.address2;
    this.city = customers.city;
    this.state = customers.state;
    this.zipcode = customers.zipcode;
};

Customers.create = (newCustomer, result) => {
    //missing fields
    const stateSet = new Set();

    stateSet.add("AL").add("AK").add("AZ").add("AR").add("CA").add("CO").add("CT").add("DE").add("FL").add("GA").add("HI").add("ID").add("IN").add("IL").add("IA").add("KS").add("KY")
        .add("LA").add("ME").add("MD").add("MA").add("MI").add("MN").add("MS").add("MO").add("MT").add("NE").add("NV").add("NH").add("NJ").add("NM").add("NY").add("NC").add("ND")
        .add("OH").add("OK").add("OR").add("PA").add("RI").add("SC").add("SD").add("TN").add("TX").add("UT").add("VT").add("VA").add("WA").add("WV").add("WI").add("WY");

    const email= newCustomer.userId;
    const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    console.log(email);

    if (newCustomer.userId == "" || newCustomer.userId == undefined || newCustomer.name == "" || newCustomer.name == undefined || newCustomer.phone == "" || newCustomer.phone == undefined || newCustomer.address == "" || newCustomer.address == undefined || newCustomer.city == "" || newCustomer.city == undefined || newCustomer.state == "" || newCustomer.state == undefined || newCustomer.zipcode == "" || newCustomer.zipcode == undefined) {
        console.log("model - missing field");
        result({errType: "missing"}, null);
    } else if (!emailRegEx.test(email)) {
        console.log("model - invalid userId");
        result({errType: "invalid userId"}, null);
    } else if (!stateSet.has(newCustomer.state)) {
        console.log("model - invalid state");
        result({errType: "invalid state"}, null);
    } else {
        console.log("querying");
        sql.query('INSERT INTO customers SET ?', newCustomer, (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
                return;
            }
            sql.query('SELECT LAST_INSERT_ID()', (err, id) => {
                if (err) {
                    console.log(err);
                    result(err, null);
                }
                result(null, {numericId: id[0]['LAST_INSERT_ID()']});
            })
        });

        //Include the call to the kafka topic
        console.log("finished querying");
    }
};

Customers.getByNumericId = (id, result) => {
    const regEx = /[0-9]/;
    if (id == undefined) {
        result({errType: "id missing"}, null);
    } else if (!regEx.test(id)) {
        result({errType: "illegal id"}, null);
    } else {
        sql.query("SELECT * FROM customers WHERE id = ?", id, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res[0]);
                return;
            }
            result({ errType: "not found" }, null);
        });
    }
};

Customers.getByUserID = (userId, result) => {
    const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (userId == undefined || userId == "") {
        result({errType: "userId missing"}, null);
    } else if (!emailRegEx.test(userId)) {
        result({errType: "invalid userId"});
    } else {
        sql.query("SELECT * FROM customers WHERE userId = ?", userId.replace("%40","@"), (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res[0]);
                return;
            }
            result({ errType: "not found" }, null);
        });
    }
}

module.exports = Customers;