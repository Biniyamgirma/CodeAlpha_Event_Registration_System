const express = require('express');
const router = express.Router();
const {
    addTicket,
    updateTicket,
    deleteTicket,
    activateTicket,
    getTicketByEentId,
    getTicketById
} = require('../../controller/ticketManagment/ticketManagment');


router.route('/getTicketByEventId/:eventId').get(getTicketByEentId);
router.route('/updateTicket/:ticketId').put(updateTicket);
router.route('/deleteTicket/:ticketId').delete(deleteTicket);
router.route('/activateTicket/:ticketId').put(activateTicket);
router.route('/getTicketById/:ticketId').get(getTicketById);
router.route('/addTicket').post(addTicket);


module.exports = router;