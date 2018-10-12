const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const db = require('../models')

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.route('/profile')
        .get((req, res) => {
            let token = req.get('cookie').replace('token=', '');
            let userID = jwt.verify(token, jwtsecret, (error, decoded) => {
                return decoded.id;
            })
            db.user.findOne({ where: { id: userID } }).then((user) => {
                console.log(user.dataValues);
                res.render("profile.hbs", {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                });
            });
        });

}