// videoModel.js
const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");

const Video = {
  getAllVideos: (callback) => {
    db.query('SELECT * FROM videos', callback);
  },

  getVideoById: (id, callback) => {
    db.query('SELECT * FROM videos WHERE id = ?', [id], callback);
  },

  addVideo: (video, callback) => {
    db.query('INSERT INTO videos SET ?', video, callback);
  },

  updateVideo: (id, video, callback) => {
    db.query('UPDATE videos SET ? WHERE id = ?', [video, id], callback);
  },

  deleteVideo: (id, callback) => {
    db.query('DELETE FROM videos WHERE id = ?', [id], callback);
  },
};

module.exports = Video;
