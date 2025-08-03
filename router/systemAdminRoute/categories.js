const express = require('express');
const { route } = require('./systemAdminRoute');
const router = express.Router();
const {getCategories, addCategory, getCategoryById, updateCategory, deleteCategory} = require('../../controller/categoriController/categoriController')

router.route('/').get(getCategories);
router.route('/add').post(addCategory);
router.route('/:id').get(getCategoryById);
router.route('/update/:id').put(updateCategory);
router.route('/delete/:id').delete(deleteCategory);

module.exports = router;