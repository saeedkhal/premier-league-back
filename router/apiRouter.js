const express = require('express');
const router = express.Router();
const {eventsController}  = require('./controller/apiController');

router.get('/events' ,eventsController);

module.exports = router 