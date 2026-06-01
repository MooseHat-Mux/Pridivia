const express = require('express');

const board_controller = require('../controllers/boardController');
const question_controller = require('../controllers/quesionController');
const tally_controller = require('../controllers/tallyController');

const router = express.Router();

// Get board page
router.get('/', board_controller.index);

// GET request for displaying question
router.get('/question', question_controller.display_question);

// POST for getting a question from the buckets
router.post('/questionbucket', question_controller.display_question);

// GET request for showing current tally
router.get('/tally', tally_controller.tally);

// POST request for updating the tally
router.post('/tally/:id/update', tally_controller.tally_update)