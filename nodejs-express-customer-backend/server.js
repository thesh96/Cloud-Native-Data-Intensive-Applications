const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
    origin:"http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => {
    res.json({ message: "REST API using NodeJS"});
});
const PORT = process.env.PORT || 3000;
require("./app/routes/customers.routes.js")(app);
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
});

