var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
var multer  = require('multer');
var upload = multer() ;
router.post(
    '/login',
    userController.validate('userLogin'),
    userController.login,
)
router.post(
    '/',
    upload.array(),
    userController.validate('createUser'),
    userController.createUser,
)
module.exports = router;
