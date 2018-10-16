const bodyParser = require('body-parser');
var multer = require('multer')
var upload = multer({ dest: './views/files/' })
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const checkAuth = require('../middlewares/authFunc');
const db = require('../models')
const pagination = require('../helpers/pagination');
const getUsers = require('../helpers/getUsers');

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    router.use(checkAuth);

    router.route('/profile')
        .get((req, res) => {
            let token = req.get('cookie').replace('token=', '');
            let userID = jwt.verify(token, jwtsecret, (error, decoded) => {
                return decoded.id;
            })

            db.user.findOne({ where: { id: userID } }).then((user) => {
                let admin = false;
                let image = '';
                if (user.role === "admin") {
                    admin = true;
                }
                if (user.avatar_path) {
                    image = user.avatar_path;
                } else {
                    image = '/images/avatar.jpg';
                }
                res.render("profile.hbs", {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    admin,
                    image
                });
            });
        })
        .put((req, res) => {
            let token = req.get('cookie').replace('token=', '');
            let userID = jwt.verify(token, jwtsecret, (error, decoded) => {
                return decoded.id;
            });
            db.user.update(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    age: req.body.age
                },
                { where: { id: userID } }
            ).then(() => { res.json("ok"); })
        })
    router.route('/avatar')
        .post(upload.single('avatar'), (req, res) => {
            let token = req.get('cookie').replace('token=', '');
            let userID = jwt.verify(token, jwtsecret, (error, decoded) => {
                return decoded.id;
            });
            return db.user.update(
                {
                    avatar_path: `/files/${req.file.filename}`,
                    avatar_name: req.file.originalname,
                },
                { where: { id: userID } }
            ).then((data) => {
                return res.json({ path: `/files/${req.file.filename}` })
            });
        })

    router.route('/all-users')
        .get((req, res) => {
            let token = req.get('cookie').replace('token=', '');
            let userID = jwt.verify(token, jwtsecret, (error, decoded) => {
                return decoded.id;
            })
            let admin = false;
            db.user.findOne({ where: { id: userID } }).then((user) => {
                if (user.role === "admin") {
                    admin = true;
                    db.user.all().then((users) => {
                        const activePage = 1;
                        const usersQty = 4;
                        let allUsers = [];
                        users.map((user) => {
                            allUsers.push(user.dataValues);
                        });
                        let usersOnpage = getUsers(allUsers, activePage, usersQty)
                        let pages = pagination(allUsers.length, activePage, usersQty)
                        res.render("allUsers.hbs", {
                            users: usersOnpage,
                            pages: pages,
                            admin,
                        });
                    });
                }
            })

        })
}