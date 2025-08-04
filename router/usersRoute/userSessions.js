const express = require('express');
const router = express.Router();
const {
    getSessionsByEventId,
    sessionRegistration
} =require('../../controller/sessionController/userSessionController');

router.route('/:eventId').get(getSessionsByEventId);
router.route('/sessionRegistration').post(sessionRegistration);

module.exports = router;