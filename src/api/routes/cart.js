const express = require('express');
var router = express.Router();
const cartController = require('../controllers/cart')
var multer  = require('multer');
var upload = multer() ;

router.post(
    '/',
    upload.array(), cartController.validate('createUpdateCart'),
    cartController.addItemsToCart
);

router.get('/', cartController.getCartItems);
router.get('/:id', cartController.getCartItem);
router.put('/:id',
    upload.array(), cartController.updateCartItem);
router.delete('/:id', cartController.deleteItemFromCart)

module.exports = router;