const express = require('express');
const router = express.Router();
const {
    getTicketsByEventId,
    getTicketById
} = require('../../controller/ticketController/ticketController')
router.route('/:eventId').get(getTicketsByEventId);
router.route('/getTicketInfo/:ticketId').get(getTicketById)

module.exports = router;