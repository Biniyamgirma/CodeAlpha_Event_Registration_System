const express = require('express');
const router = express.Router();

//user routes
router.route('/user/register').post();
router.route('user/login').post();
router.route('/user/logout').post();
router.route('/user/reset-password').post();

// Define the auth routes for organizers
router.route('/organizer/register').post();
router.route('/organizer/login').post();
router.route('/organizer/logout').post();
router.route('/organizer/reset-password').post();

// Define the user routes admin
router.route('/admin/register').post();
router.route('/admin/login').post();
router.route('/admin/logout').post();
router.route('/admin/reset-password').post();


module.exports = router;