var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
const userController = require('../controllers/user')
/* GET users listing. */

router.post(
    '/login',
    userController.validate('userLogin'),
    userController.login,
)
router.post(
    '/',
    userController.validate('createUser'),
    userController.createUser,
)
module.exports = router;
