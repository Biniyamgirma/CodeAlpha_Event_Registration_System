const express = require('express');
const router = express.Router();
const {
    registrations,
    getRegisteredTickets,
    cancelRegistration
} = require('../../controller/registrationController/registrationController')
router.route('/register').post(registrations);
router.route('/viewConfirmed/:registrationId').get(getRegisteredTickets)
router.route('/cancelRegistration/:registrationId').delete(cancelRegistration);
module.exports = router;