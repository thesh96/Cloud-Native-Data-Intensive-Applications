const sql = require("./db.js");
const Books = function(books) {
    this.ISBN = books.ISBN;
    this.title = books.title;
    this.Author = books.Author;
    this.description = books.description;
    this.genre = books.genre;
    this.price = books.price;
    this.quantity = books.quantity;
};

Books.create = (newBook, result) => {
    //missing fields
    if (newBook.ISBN == "" || newBook.ISBN == undefined || newBook.title == "" || newBook.title == undefined || newBook.Author == "" || newBook.Author == undefined || newBook.description == "" || newBook.description == undefined || newBook.genre == "" || newBook.genre == undefined || newBook.price.toString() == "" || newBook.price.toString() == undefined || newBook.quantity.toString() == "" || newBook.quantity.toString() == undefined) {
        console.log("model - missing field");
        result({errType: "missing"}, null);
    }else if (newBook.price.toString().includes(".") && (newBook.price.toString().split(".")[1].length > 2)) {
        console.log("model - invalid price");
        result({errType: "invalid price"}, null);
    } else {
        console.log("querying");
        sql.query('INSERT INTO books SET ?', newBook, (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
                return;
            }
            result(null, {...newBook});
        });
        console.log("finished querying");
    }
};

Books.update = (id, newBook, result) => {
    console.log("model");
    if (newBook.ISBN == "" || newBook.ISBN == undefined || newBook.title == "" || newBook.title == undefined || newBook.Author == "" || newBook.Author == undefined || newBook.description == "" || newBook.description == undefined || newBook.genre == "" || newBook.genre == undefined || newBook.price.toString() == "" || newBook.price.toString() == undefined || newBook.quantity.toString() == "" || newBook.quantity.toString() == undefined) {
        console.log("model - missing field");
        result({errType: "missing"}, null);
    }else if (newBook.price.toString().includes(".") && (newBook.price.toString().split(".")[1].length > 2)) {
        console.log("model - invalid price");
        result({errType: "invalid price"}, null);
    } else {
        sql.query("UPDATE books SET title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?",
            [newBook.title, newBook.Author, newBook.description, newBook.genre, newBook.price, newBook.quantity, id], (err, res) => {
                if (err) {
                    console.log(err);
                    result(err, null);
                    return;
                }else if (res.affectedRows == 0) {
                    result({errType:"not_found"}, null);
                }else {
                    result(null, {ISBN: id, ...newBook});
                }
            });
    }
};

Books.get = (id, result) => {
    sql.query("SELECT * FROM books WHERE ISBN = ?", id, (err, res) => {
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
};

module.exports = Books;