const express = require('express');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const board_controller = require('../controllers/boardController');
const question_controller = require('../controllers/questionController');
const tally_controller = require('../controllers/tallyController');

const router = express.Router();

// Get board page
router.get("/", board_controller.index);

// Should return json data for board
router.get("/currentboard", board_controller.board_data);

// GET request for displaying question
router.get('/question', question_controller.question_page);

// POST for getting a question from the buckets
router.post('/questiondisplay', question_controller.display_question);

// POST for getting a question from the buckets
router.post('/updateboard', board_controller.update_board);

// POST for getting a question from the buckets
router.post('/newquestion', question_controller.add_question);

// POST for getting a question from the buckets
router.post('/updatequestion', question_controller.update_questionbucket);

// POST for getting a question from the buckets
router.post('/replacequestion', question_controller.replace_questionbucket);

// POST for getting a question from the buckets
router.post('/timer', question_controller.timer_set);

// GET request for showing current tally
router.get('/tally', tally_controller.tally_check);

// POST request for updating the tally
router.post('/tally/update', tally_controller.tally_update);

// GET request for showing chatter data
router.get('/chatters', question_controller.show_chatters);

// POST request for creating chatter data
router.post('/chatter', question_controller.create_chatter);

module.exports = router;