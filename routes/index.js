const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();
const checkAuth = require('../middlewares/authFunc');
const db = require('../models')
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = "mysecretkey"; // ключ для подписи JWT

module.exports = (app) => {
  Object.keys(routes).forEach((routeName) => {
    const router = express.Router();

    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`./${routeName}`)(router);

    app.use(`/${changeCase.paramCase(routeName)}`, router);
  });

  app.get('/home', checkAuth, (req, res) => {
    let token = req.get('cookie').replace('token=', '');
    let userID = jwt.verify(token, jwtsecret, (error, decoded) => {
      return decoded.id;
    })
    db.user.findOne({ where: { id: userID } }).then((user) => {
      let admin = false;
                if (user.role === "admin") {
                    admin = true;
                }
      res.render("partials/home.hbs", {
        userName: user.firstName + ' ' + user.lastName,
        admin,
      });
    });

  })
  app.get('/', (req, res) => {
    res.render("welcome.hbs");
  })

};