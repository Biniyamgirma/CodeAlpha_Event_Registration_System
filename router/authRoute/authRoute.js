const express = require('express');
const router = express.Router();
const {
    registerUser,
  loginUser,
  changePassword,
  registerOrganizer
} = require('../../controller/usersController/usersController');
//user routes
router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').post();
router.route('/user/reset-password').post(changePassword);



module.exports = router;