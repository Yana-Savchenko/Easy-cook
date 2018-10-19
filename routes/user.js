const bodyParser = require('body-parser');
const multer = require('multer')
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const Op = Sequelize.Op
const upload = multer({ dest: './views/files/' })
const checkAuth = require('../middlewares/authFunc');
const checkAccess = require('../middlewares/checkAccess');
const db = require('../models')
const pagination = require('../helpers/pagination');


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
        .put(async (req, res) => {
            var appDir = path.dirname(require.main.filename);
            try {
                const user = await db.user.findOne({
                    where: {
                        [Op.and]: [{ email: req.body.email },
                        { id: { [Op.not]: req.user.id } }]
                    }
                })
                if (user) {
                    return res.status(400).json({ message: 'Invalid email' })
                }
                await db.user.update({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    age: req.body.age
                },
                    { where: { id: req.user.id } });
                return res.json("ok")

            } catch (err) {
                return res.status(500).json({ message: err.message })
            }

        })
    router.route('/profile/:email')
        .get((req, res) => {

        })
    router.route('/avatar')
        .post(upload.single('avatar'), (req, res) => {
            return db.user.findOne({ where: { id: req.user.id } }).then((user) => {
                return db.user.update(
                    {
                        avatar_path: `/files/${req.file.filename}`,
                        avatar_name: req.file.originalname,
                    },
                    { where: { id: req.user.id } }
                ).then((data) => {
                    if (user.dataValues.avatar_path) {
                        const path3 = path.resolve(__dirname, '../') + '/views' + user.dataValues.avatar_path;
                        fs.unlinkSync(path3);
                    }
                    return res.json({ path: `/files/${req.file.filename}`, oldPath: user.dataValues.avatar_path })
                });
            })
        })

    router.route('/all-users')
        .get(checkAccess, (req, res) => {
            if (!req.admin) {
                return res.render("pageNotFound.hbs");
            }
            const limit = config.usersQty;
            const offset = limit * ((req.query.page || 1) - 1);
            const direction = ((req.query.direction || "down") === 'down') ? 'ASC' : 'DESC';
            const queryParams = {
                limit,
                offset,
                order: [[req.query.column || "firstName", direction]]
            }
            db.user.findAll(queryParams).then((users) => {
                let allUsers = [];
                users.map((user) => {
                    allUsers.push(user.dataValues);
                });
                db.user.count().then((count) => {
                    let pages = pagination(count, req.query.page);
                    return res.render("allUsers.hbs", {
                        users: allUsers,
                        pages: pages,
                        admin: req.admin,
                        direction: req.query.direction || 'down',
                    });
                })
            });

        })

    router.route('/all-users/search')
        .get(checkAccess, (req, res) => {
            if (!req.admin) {
                return res.render("pageNotFound.hbs");
            }
            const limit = config.usersQty;
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