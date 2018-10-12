const express = require("express");
const app = express();
const hbs = require('hbs')
const bodyParser = require('body-parser');
const sequelize = require('./db');
// const auth = require('./routes/auth');
var cookieParser = require('cookie-parser')
const router = require('./routes')

// set hbs engine
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

// app.use(auth);
app.use(express.static('views'));
hbs.registerPartials(__dirname + "/views/partials");

router(app);


app.listen(3000);