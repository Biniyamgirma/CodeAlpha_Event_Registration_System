const express = require('express');
const router = express.Router();
const multer = require('multer');
//events router //add events //get event by id //create event
//  //update event //delete event
const storage = require('../../config/fileStorageEngine').constants.storage;
const upload = multer({ storage: storage});

router.route('/addEvents').post(upload.single('eventImage'),);
router.route('/:eventId').get();
router.route('/:organizerId').get();
router.route('/:eventId').put();
router.route('/:eventId').delete();

module.exports = router;