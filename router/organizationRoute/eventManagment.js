const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    addEvent,
    getEventById,
    getEventsByOrganizerId,
    updateEvent,
    deleteEvent
} = require('../../controller/eventManagment/eventManagmentController');
//events router //add events //get event by id //create event
//  //update event //delete event
const storage = require('../../config/fileStorageEngine').constants.storage;
const upload = multer({ storage: storage});

router.route('/addEvents').post(upload.single('eventImage'),addEvent);
router.route('/:eventId').get(getEventById);
router.route('/:organizerId').get(getEventsByOrganizerId);
router.route('/:eventId').put(upload.single('eventImage'), updateEvent);
router.route('/:eventId').delete(deleteEvent);

module.exports = router;