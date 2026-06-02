const tally_controller = require('../controllers/tallyController');
const express = require("express");

const router = express.Router();

// GET request for showing current tally
router.get('/tally', tally_controller.tally);

// POST request for updating the tally
router.post('/tally/:id/update', tally_controller.tally_update)

module.exports = router