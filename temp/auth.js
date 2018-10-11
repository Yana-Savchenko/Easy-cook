const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const db = require('../models')
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", function (request, response) {
    response.render("signIn.hbs");
});
router.get("/sign-up", function (request, response) {
    response.render("signUp.hbs");
})
router.post("/sign-up", function (req, res) {
    let hash = bcrypt.hashSync(req.body.pass, 10);
    db.user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age,
        password: hash
    })
        .then((user) => { 
            if(user) {
                return res.redirect('/');
            }
         })
})

router.post("/sign-in", (req, res, next) => {
    db.user.findOne({ where: { email: req.body.email } }).then((user) => {
        console.log(user);
        if (user) {
            if (bcrypt.compareSync(req.body.pass, user.dataValues.password)) {
                const payload = {
                    id: user.dataValues.id,
                    email: user.dataValues.email
                }
                const token = jwt.sign(payload, jwtsecret);
                console.log(token, user.dataValues);
                return res.json({message: "ok", token:token, user: user.dataValues});
            } else {
                return res.status(401).send('Incorrect password');
            }
        }
        return res.send("Incorrect email");
        
    });
});
module.exports = router;