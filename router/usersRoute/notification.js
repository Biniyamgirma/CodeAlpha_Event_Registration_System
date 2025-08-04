const express = require('express');
const router = express.Router();
const {getNotification,updateNotification} = require('../../controller/notificationController/notificationController');

router.route('/getNotification/:id').get(getNotification);
router.route('/updateNotification/:id').put(updateNotification);

module.exports = router;