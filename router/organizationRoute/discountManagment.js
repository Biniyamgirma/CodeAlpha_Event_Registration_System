const express = require('express');
const router = express.Router();
const {
    addDiscount,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    getActiveDiscounts,
    activateDiscountById,
    getDiscountByOrganizerId,
    eventDiscountMapping,
    getDiscountByEventId
} = require('../../controller/discountController/discountController');
router.route('/addDiscount').post(addDiscount);
router.route('/:discountId').get(getDiscountById);
router.route('/:discountId').put(updateDiscount);
router.route('/:discountId').delete(deleteDiscount);
router.route('/activeDiscounts').post(activateDiscountById);
router.route('/getDiscountByEventId/:eventId').get(getDiscountByEventId);
router.route('/getDiscountByOrganizerId/:organizerId').get(getDiscountByOrganizerId);
router.route('/eventDiscountMapping').post(eventDiscountMapping);
router.route('/getActiveDiscounts').get(getActiveDiscounts);

module.exports = router;