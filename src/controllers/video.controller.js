// videoController.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const Video = require('./videoModel');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
  Video.getAllVideos((err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Video.getVideoById(id, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
    });
    const video = {
      title: req.body.title,
      url: result.secure_url,
    };
    Video.addVideo(video, (err, result) => {
      if (err) throw err;
      res.json({ message: 'Video added successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading video' });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const video = {
    title: req.body.title,
  };
  Video.updateVideo(id, video, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Video updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Video.deleteVideo(id, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Video deleted successfully' });
  });
});

module.exports = router;
