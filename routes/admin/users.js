const express = require('express');
const router = express.Router();

// user controller
const userController = require('../../controllers/usersController');

//get user list
router.get('/', userController.getUsers);


module.exports = router;