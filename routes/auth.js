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
                return res.redirect('/home');
            }
         })
})

router.post("/sign-in", (req, res, next) => {
    db.user.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
            if (bcrypt.compareSync(req.body.pass, user.dataValues.password)) {
                const payload = {
                    id: user.dataValues.id,
                    email: user.dataValues.email
                }
                const token = jwt.sign(payload, jwtsecret);
                console.log(token);
                jwt.verify(token, jwtsecret, (error, decoded) =>{
                    console.log(decoded);
                })
                return res.redirect('/home');
            } else {
                return res.status(401).send('Incorrect password');
            }
        }
        return res.send("Incorrect email");
        
    });
});
module.exports = router;