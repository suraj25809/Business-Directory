const express = require('express');
const router = express.Router();

// feedback controller
const feedbackController = require('../../controllers/feedbackController');

//get feedback list
router.get('/', feedbackController.getFeedback);


module.exports = router;