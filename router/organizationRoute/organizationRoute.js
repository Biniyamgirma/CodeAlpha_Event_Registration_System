const express = require('express');
const router = express.Router();
const {getByEventId,
    getActiveRegistration,
    getActiveRegistrationByTicketId,
    canceledRegistrationByEventId} = require('../../controller/registrationController/eventOrganizerController');
const { getEventById } = require('../../controller/eventManagment/eventManagmentController');
const rbacMiddleware = require('../../middleware/roleBasedAccessControl/rbacMiddleware')
router.route('/getByEventId/:eventId').get(rbacMiddleware(1),getByEventId);
router.route('/getActiveRegistration/:eventId').get(rbacMiddleware(1),getActiveRegistration);
router.route('/getActiveRegistrationByTicket/:ticketId').get(rbacMiddleware(1),getActiveRegistrationByTicketId);
router.route('/canceledRegistration/:eventId').get(rbacMiddleware(1),canceledRegistrationByEventId)


module.exports = router;