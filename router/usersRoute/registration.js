const express = require('express');
const router = express.Router();

router.route('/register').post();
router.route('/paymentConfermed/:registrationId').put()
module.exports = router;