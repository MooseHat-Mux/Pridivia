const express = require('express');

const board_controller = require('../controllers/boardController');

const router = express.Router();

// Get board page
router.get("/", board_controller.index);

module.exports = router;