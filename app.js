const express = require("express");
const app = express();
const hbs = require('hbs')
const bodyParser = require('body-parser');
const sequelize = require('./db');
const auth = require('./routes/auth');

// set hbs engine
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth);
app.use(express.static('views'));
hbs.registerPartials(__dirname + "/views/partials");


app.get('/home', (req, res) => {
    res.render("home.hbs");;
})
app.listen(3000);