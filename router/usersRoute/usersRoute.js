const router = require('express').Router();
const { registerUser } = require('../../controller/usersController/usersController');

router.post('/register',registerUser);




module.exports = router;