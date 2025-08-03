const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../../config/fileStorageEngine').constants.storage;
const {
    getAllSponsors,
    createSponsor,
    updateSponsor,
    getSponsorById,
    getSponsorByEventId,
     blockSponsor
} = require('../../controller/sponsorController/sponsorController');

const upload = multer({ storage: storage });

router.route('/').get(getAllSponsors);
router.route('/regiter', upload.single('logo')).post(createSponsor);
router.route('/update', upload.single('logo')).put(updateSponsor);
router.route('/sponsor/:id').get(getSponsorById);
router.route('/block/sponsor/:id').post(blockSponsor);
router.route('/event/:eventId').get(getSponsorByEventId);

module.exports = router;