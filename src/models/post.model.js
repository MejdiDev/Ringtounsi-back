// post.model.js
const query = require("../db/db-connection");

class PostModel {
  tableName = "posts";

  getAllPosts(callback) {
    const sql = `
      SELECT ${this.tableName}.*, user.nom, user.prenom
      FROM ${this.tableName}
      LEFT OUTER JOIN user ON ${this.tableName}.coachId = user.id
    `;
    query(sql, callback);
  }

  getPostById(id, callback) {
    const sql = `
      SELECT ${this.tableName}.*, user.nom AS nomCoach
      FROM ${this.tableName}
      JOIN user ON ${this.tableName}.coachId = user.id
      WHERE user.role = 'Coach' AND ${this.tableName}.id = ?
    `;
    query(sql, [id], callback);
  }

  addPost(post, callback) {
    const sql = `
        INSERT INTO ${this.tableName}
        SET coachId = ?, description = ?, imageUrl = ?, videoUrl = ?, text = ?
    `;
    const { coachId, description, imageUrl, videoUrl, text } = post;
    query(
      sql,
      [coachId, description, imageUrl, videoUrl, text],
      (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          const insertedPostId = result.insertId;
          this.getPostById(insertedPostId, callback);
        }
      }
    );
  }

  updatePost(id, post, callback) {
    const { description, imageUrl, videoUrl, text } = post;
    const sql = `UPDATE ${this.tableName} SET description = ?, imageUrl = ?, videoUrl = ?, text = ? WHERE id = ?`;
    query(sql, [description, imageUrl, videoUrl, text, id], callback);
  }

  deletePost = async(id, callback) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  }
}

module.exports = PostModel;
