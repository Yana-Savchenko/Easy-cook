var jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    if(!req.get('cookie')){
        return res.redirect('/auth/sign-in');
    }
    let token = req.get('cookie').replace('token=', '');
    jwt.verify(token, 'mysecretkey', (err, decoded) => {
        if (err) {
            return res.redirect('/auth/sign-in');
        }
        if (decoded) {
            req.user = decoded;
            next();
        }
    });
}
module.exports = checkAuth;