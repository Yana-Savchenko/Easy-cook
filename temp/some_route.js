const auth = require('../middlewares/auth');
const meetingCtrl = require('../controllers/meeting');
const acl = require('../middlewares/acl');

module.exports = (router) => {
  // router.use(auth.authRequired);

  router.route('/')
    .all(acl.hasActionPermission('meeting'))
    .get((req, res) => meetingCtrl.getAll(req, res))
    .post((req, res) => meetingCtrl.create(req, res));

  router.route('/:id')
    .all(
      acl.hasActionPermission('meeting'),
      acl.hasAccessibleEntityData('meeting')
    )
    .get((req, res) => meetingCtrl.getOne(req, res))
    .put((req, res) => meetingCtrl.updateOne(req, res))
    .delete((req, res) => meetingCtrl.deleteOne(req, res));

  router.route('/add')
    .all(acl.hasActionPermission('meeting'))
    .post((req, res) => meetingCtrl.addFeedbacks(req, res));

  router.route('/remove')
    .all(acl.hasActionPermission('meeting'))
    .post((req, res) => meetingCtrl.removeFeedbacks(req, res));
};