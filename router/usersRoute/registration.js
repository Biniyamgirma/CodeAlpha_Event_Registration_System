const express = require('express');
const router = express.Router();
const {
    registrations
} = require('../../controller/registrationController/registrationController')
router.route('/register').post(registrations);
// router.route('/paymentConfirmed/:registrationId').put()
module.exports = router;