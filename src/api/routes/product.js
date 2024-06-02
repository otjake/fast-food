const express = require('express');
var router = express.Router();
const productController = require('../controllers/product')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './product-images');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

let upload = multer({ storage })

router.post(
    '/',upload.single('image'),
    productController.validate('createUpdateProduct'),
    productController.createProduct,
);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct)

module.exports = router;