const express = require('express');
var router = express.Router();
const categoryController = require('../controllers/category')

router.post(
    '/',
    categoryController.validate('categoryUpdateOrCreate'),
    categoryController.createCategory,
);

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.put('/:id', categoryController.validate('categoryUpdateOrCreate'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory)

module.exports = router;