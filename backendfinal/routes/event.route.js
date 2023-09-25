const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/new_event',eventController.createEvent);
router.post('/event_by_cours',eventController.getEventsForUser);
router.get('/:id',eventController.getEvent);
router.post('/event_by_coach', eventController.getEventsByCoach);



module.exports = router;