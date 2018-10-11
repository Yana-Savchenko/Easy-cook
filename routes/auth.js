const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const db = require('../models')

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.route('/')
        .get((req, res) => {
            res.render("signIn.hbs");
        });

    router.route('/sign-up')
        .get((req, res) => {
            res.render("signUp.hbs");
        })
        .post((req, res) => {
            let hash = bcrypt.hashSync(req.body.pass, 10);
            db.user.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                age: req.body.age,
                password: hash
            })
                .then((user) => {
                    if (user) {
                        return res.redirect('/auth/sign-in');
                    }
                })
        })

    router.route('/sign-in')
        .get((req, res) => {
            res.render("signIn.hbs");
        })
        .post((req, res) => {
            db.user.findOne({ where: { email: req.body.email } }).then((user) => {
                if (user) {
                    if (bcrypt.compareSync(req.body.pass, user.dataValues.password)) {
                        const payload = {
                            id: user.dataValues.id,
                            email: user.dataValues.email
                        }
                        const token = jwt.sign(payload, jwtsecret);
                        return res.json({ message: "ok", token: token, user: user.dataValues });
                    } else {
                        return res.status(401).send('Incorrect password');
                    }
                }
                return res.send("Incorrect email");

            });
        });
}