const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    registerUser,
  loginUser,
  changePassword,
  registerOrganizer
} = require('../../controller/usersController/usersController');
const storage = require('../../config/fileStorageEngine').constants.storage;
const upload = multer({storage:storage});
//user routes
router.route('/user/register').post(upload.single('profileImage'),registerUser);
router.route('/user/login').post(loginUser);
// router.route('/user/logout').post();
router.route('/user/reset-password').post(changePassword);



module.exports = router;