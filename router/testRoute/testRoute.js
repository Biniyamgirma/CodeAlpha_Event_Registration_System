const express = require('express');
const router = express.Router();
const { test } = require('../../controller/testController/testController');
// Define the test route

router.route('/').get(test);


module.exports = router;