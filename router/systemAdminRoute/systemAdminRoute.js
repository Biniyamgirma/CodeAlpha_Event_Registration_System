const express = require('express');
const router = express.Router();
const {
  verifyOrganizer,
    verifyUser,
    blockOrganizer,
    blockUser,
    registerOrganizer,
    assignAdminPrivelage
} = require('../../controller/adminController/adminController');

router.route('/register-organizer').post(registerOrganizer)
router.route('/assign-admin').post(assignAdminPrivelage)
router.route('/verify-organizer').post(verifyOrganizer)
router.route('/verify-user').post(verifyUser)
router.route('/block-organizer').post(blockOrganizer)
router.route('/block-user').post(blockUser)

module.exports = router;