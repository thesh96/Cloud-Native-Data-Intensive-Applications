const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
    origin: "http://localhost:80"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Nodejs book bff" });
});
const PORT = process.env.PORT || 80;
require("./app/routes/bookbff.routes.js")(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

