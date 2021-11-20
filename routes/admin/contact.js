const express = require('express');
const router = express.Router();

// contact controller
const contactController = require('../../controllers/contactController');

//get contact list
router.get('/', contactController.getContact);


module.exports = router;