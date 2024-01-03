const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const {
  createVideoSchema,
  updateVideoSchema,
} = require('../middleware/validators/videoValidator.middleware');

router.get('/', auth(), awaitHandlerFactory(videoController.getAllVideos)); // localhost:3000/api/v1/videos
router.get('/id/:id', auth(), awaitHandlerFactory(videoController.getVideoById)); // localhost:3000/api/v1/videos/id/1
router.post('/', createVideoSchema, awaitHandlerFactory(videoController.createVideo)); // localhost:3000/api/v1/videos
router.patch('/id/:id', updateVideoSchema, awaitHandlerFactory(videoController.updateVideo)); // localhost:3000/api/v1/videos/id/1, using patch for partial update
router.delete('/id/:id', auth(), awaitHandlerFactory(videoController.deleteVideo)); // localhost:3000/api/v1/videos/id/1

module.exports = router;
