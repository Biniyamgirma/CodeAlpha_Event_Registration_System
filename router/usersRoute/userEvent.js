const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    searchEventsByLocation
} = require('../../controller/eventController/eventController')

router.route('/').get(getAllEvents);
router.route('/:id').get(getEventById);
router.route('/location/:location').get(searchEventsByLocation);


module.exports = router;