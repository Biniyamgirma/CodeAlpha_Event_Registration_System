const express = require('express');
const router = express.Router();
const multer = require('multer');
const rbacMiddleware = require('../../middleware/roleBasedAccessControl/rbacMiddleware')
const {
    addEvent,
    getEventById,
    getEventsByOrganizerId,
    updateEvent,
    deleteEvent
} = require('../../controller/eventManagment/eventManagmentController');

const storage = require('../../config/fileStorageEngine').constants.storage;
const upload = multer({ storage: storage});

router.route('/addEvents').post(upload.single('eventImage'),rbacMiddleware(1),addEvent);
router.route('/:eventId').get(rbacMiddleware(1), getEventById);
router.route('/:organizerId').get(rbacMiddleware(1), getEventsByOrganizerId);
router.route('/:eventId').put(upload.single('eventImage'),rbacMiddleware(1), updateEvent);
router.route('/:eventId').delete(rbacMiddleware(1),deleteEvent);


module.exports = router;