const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../../config/fileStorageEngine').constants.storage;
const upload = multer({storage:storage});
const {
    createSession,
    updateSession,
    getSessionsByEventId,
    disableSession,
    enableSession
} = require('../../controller/sessionController/sessionController')
const {
    addSessionSpeaker,
    updateSessionSpeaker,
    disableSessionSpeaker,
    enableSessionSpeaker,
    getSessionSpeakersBySessionId,
    sessionSpeakerMapping
} = require('../../controller/sessionController/sessionSpeakerController');

router.route('/addSession').post(createSession); // Create a new session
router.route('/updateSession/:sessionId').put(updateSession);// Update a session by ID
router.route('/disableSession/:sessionId').put(disableSession); // Disable a session by ID
router.route('/enableSession/:sessionId').put(enableSession); // Enable a session by ID
router.route('/getSessionByEventId/:eventId').get(getSessionsByEventId); // Get sessions by event ID

router.route('/addSessionSpeaker').post(upload.single('image') ,addSessionSpeaker);
router.route('/updateSessionSpeaker/:speakerId').put(upload.single('image') ,updateSessionSpeaker);
router.route('/disableSessionSpeaker/:speakerId').delete(disableSessionSpeaker);
router.route('/enableSessionSpeaker/:speakerId').put(enableSessionSpeaker);
router.route('/getSessionSpeakersBySessionId/:sessionId').get(getSessionSpeakersBySessionId);

router.route('/sessionSpeakerMapping').post(sessionSpeakerMapping);

module.exports = router;