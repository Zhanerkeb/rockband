const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require('./models');

var Sequelize = require("sequelize");

var sequelize = new Sequelize("RockBand", 'rock_band_admin', 'qwerty', {
    host: "localhost",
    port: 1433,
    dialect: "mssql",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        options: { encrypt: true }
    }
});

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// app.get('/', async (req, res) => {
//     let rockBands = await db.Rock_Band.findAll();
//
//     res.send(rockBands);
// });

app.use("/contact", function(request, response){

    response.render("contact", {
        title: "Мои контакты",
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
});

app.get("/", function(request, response){

    response.send("Главная страница");
});

app.listen(5000, () => console.log("server started"));
