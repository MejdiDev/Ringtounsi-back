const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const coachController = require('../controllers/coach.controller');

router.get('/',awaitHandlerFactory(coachController.getCoachUsers)); // localhost:3000/api/v1/coaches
router.post('/', awaitHandlerFactory(coachController.createCoachUser)); // localhost:3000/api/v1/coaches
router.patch('/id/:id', awaitHandlerFactory(coachController.updateCoachUser)); // localhost:3000/api/v1/coaches/id/1
router.delete('/id/:id', auth(), awaitHandlerFactory(coachController.deleteCoachUser)); // localhost:3000/api/v1/coaches/id/1

module.exports = router;
