const bodyParser = require('body-parser');
var multer = require('multer')
const fs = require('fs');
var upload = multer({ dest: './views/files/' })
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const checkAuth = require('../middlewares/authFunc');
const checkAccess = require('../middlewares/checkAccess');
const sortUsers = require('../helpers/sortUsers')
const db = require('../models')
const pagination = require('../helpers/pagination');
const getUsers = require('../helpers/getUsers');

module.exports = (router) => {

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    router.use(checkAuth);

    router.route('/profile')
        .get(checkAccess, (req, res) => {
            db.user.findOne({ where: { id: req.user.id } }).then((user) => {
                let image = '';
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
                    admin: req.admin,
                    image
                });
            });
        })
        .put((req, res) => {
            db.user.update(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    age: req.body.age
                },
                { where: { id: req.user.id } }
            ).then(() => { res.json("ok"); })
        })
    router.route('/avatar')
        .post(upload.single('avatar'), (req, res) => {
            return db.user.update(
                {
                    avatar_path: `/files/${req.file.filename}`,
                    avatar_name: req.file.originalname,
                },
                { where: { id: req.user.id } }
            ).then((data) => {
                return res.json({ path: `/files/${req.file.filename}` })
            });
        })

    router.route('/all-users')
        .get(checkAccess, (req, res) => {
            console.log(req.params);
            if (!req.admin) {
                return res.render("pageNotFound.hbs");
            }
            db.user.all().then((users) => {
                let allUsers = [];
                users.map((user) => {
                    allUsers.push(user.dataValues);
                });
                allUsers = sortUsers(allUsers);
                let usersOnpage = getUsers(allUsers)
                let pages = pagination(allUsers.length)
                return res.render("allUsers.hbs", {
                    users: usersOnpage,
                    pages: pages,
                    admin: req.admin,
                    direction: "down",
                });
            });

        })

    router.route('/all-users/sort')
        .get(checkAccess, (req, res) => {
            console.log(req.query);

            if (!req.admin) {
                return res.render("pageNotFound.hbs");
            }
            db.user.all().then((users) => {
                let allUsers = [];
                users.map((user) => {
                    allUsers.push(user.dataValues);
                });
                allUsers = sortUsers(allUsers, req.query.column, req.query.direction);
                let usersOnpage = getUsers(allUsers, req.query.page)
                let pages = pagination(allUsers.length, req.query.page)
                return res.render("partials/usersList.hbs", {
                    users: usersOnpage,
                    pages: pages,
                    direction: req.query.direction,
                });
            });
        })

    router.route('/all-users/:page')
        .get(checkAccess, (req, res) => {
            console.log(req.query);

            if (!req.admin) {
                return res.render("pageNotFound.hbs");
            }
            db.user.all().then((users) => {
                let allUsers = [];
                users.map((user) => {
                    allUsers.push(user.dataValues);
                });
                allUsers = sortUsers(allUsers, req.query.column, req.query.direction);
                let usersOnpage = getUsers(allUsers, req.params.page)
                let pages = pagination(allUsers.length, req.params.page)
                return res.render("partials/usersList.hbs", {
                    users: usersOnpage,
                    pages: pages,
                    direction: req.query.direction,
                });
            });
        })

}