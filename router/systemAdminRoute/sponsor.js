const express = require('express');
const router = express.Router();

const {
    getAllSponsors,
    createSponsor,
    updateSponsor,
    getSponsorById,
    getSponsorByEventId,
     blockSponsor
} = require('../../controller/sponsorController/sponsorController');

router.route('/').get(getAllSponsors);
router.route('/regiter').post(createSponsor);
router.route('/update').put(updateSponsor);
router.route('/sponsor/:id').get(getSponsorById);
router.route('/block/sponsor/:id').post(blockSponsor);
router.route('/event/:eventId').get(getSponsorByEventId);

module.exports = router;