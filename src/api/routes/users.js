var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')

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
