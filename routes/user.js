const bodyParser = require('body-parser');
var multer = require('multer')
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
var upload = multer({ dest: './views/files/' })
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

    router.route('/all-users/search')
        .get(checkAccess, (req, res) => {
            if (!req.admin) {
                return res.render("pageNotFound.hbs");
            }
            const limit = 3;
            const offset = limit * ((req.query.page || 1) - 1);
            const direction = ((req.query.direction || "down") === 'down') ? 'ASC' : 'DESC';
            const queryParams = {
                where: {},
                limit,
                offset,
                order: [[req.query.column || "firstName", direction]]
            }
            if (req.query.search_data) {
                queryParams.where = {
                    [Op.or]: [
                        { firstName: { [Op.iLike]: `%${req.query.search_data}%` } },
                        { lastName: { [Op.iLike]: `%${req.query.search_data}%` } },
                        { email: { [Op.iLike]: `%${req.query.search_data}%` } }
                    ]
                }
            }
            return db.user.findAll(queryParams)
                .then((users) => {
                    let allUsers = [];
                    users.map((user) => {
                        allUsers.push(user.dataValues);
                    });
                    db.user.count(queryParams).then((count) => {
                        let pages = pagination(count, req.query.page);
                        return res.render("partials/usersList.hbs", {
                            users: allUsers,
                            pages: pages,
                            direction: req.query.direction || 'down',
                        });
                    })
                })
            // .catch(err => res.render());
        })
}