const router = require('express').Router();
const { registerUser } = require('../../controller/usersController/usersController');
const {
    registerUser,
  loginUser,
  changePassword,
  deleteAccount,
  changeInfo
} = require('../../controller/usersController/usersController');
const multer = require('multer');
const storage = require('../../config/fileStorageEngine');
const upload = multer({storage:storage});

//user management router //get users details //get user by id //update user details 
// //delete user//search user by name //search user by email// serch user by phone number

router.route('/register').post(upload.single('profile_image'),registerUser);
router.route('/login').post(loginUser);
router.route('/change-password').post(changePassword);
router.route('/deleteAccount/:id').delete(deleteAccount);
router.route('/changeInfo/:id').put(changeInfo);




module.exports = router;