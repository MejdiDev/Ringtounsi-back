const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
const Role = require("../utils/userRoles.utils");

class UserModel {
  tableName = "user";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async ({
    nom,
    prenom,
    email,
    password,
    date_inscription,
    role = Role.Athlete,
    status = "pending", // Added the status field with a default value 'pending'
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (nom, prenom, email, password, date_inscription, role, status) VALUES (?,?,?,?,?,?,?)`;

    const result = await query(sql, [
      nom,
      prenom,
      email,
      password,
      date_inscription,
      role,
      status,
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  ///////
  rateCoach = async (userId, coachId, rating) => {
    const sql = `INSERT INTO coach_rating (user_id, coach_id, rating) VALUES (?, ?, ?)`;
    const result = await query(sql, [userId, coachId, rating]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };
  //////
  getCoachRatingById = async (coachId) => {
    const sql = `
    SELECT
      AVG(rating) AS moyenne_evaluation
    FROM
      coach_rating
    WHERE
      coach_id = ?;
  `;

    const result = await query(sql, [coachId]);
    return result[0]; // Retourne le résultat de la requête, qui devrait contenir la moyenne du rating du coach avec l'ID spécifié
  };

  addComment = async ({ userId, coachId, comment, rating }) => {
    const currentTimestamp = new Date(); // Get the current timestamp

    const sql = `
    INSERT INTO coach_comment (user_id, coach_id, comment, created_at, rating)
    VALUES (?, ?, ?, ?, ?)
  `;

    const result = await query(sql, [
      userId,
      coachId,
      comment,
      currentTimestamp,
      rating
    ]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  getAllUsers = async () => {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT user.*, GROUP_CONCAT(posts.description SEPARATOR ', ') AS posts
      FROM ${this.tableName}
      LEFT JOIN posts ON ${this.tableName}.id = posts.coachId
      WHERE ${this.tableName}.role = 'Coach'
      GROUP BY ${this.tableName}.id
    `;
      query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  getUserById = async (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT ${this.tableName}.*, GROUP_CONCAT(posts.description SEPARATOR ', ') AS posts
      FROM ${this.tableName}
      LEFT JOIN posts ON ${this.tableName}.id = posts.coachId
      WHERE ${this.tableName}.role = 'Coach' AND ${this.tableName}.id = ?
      GROUP BY ${this.tableName}.id
    `;
      query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]); // Retourne le premier résultat car il s'agit de getUserById
        }
      });
    });
  };

  getCoachComments = async (coachId) => {
    const sql = `
    SELECT
      cc.*,
      u.nom AS user_nom,
      u.prenom AS user_prenom
    FROM coach_comment cc
    INNER JOIN user u ON cc.user_id = u.id
    WHERE cc.coach_id = ?
  `;
    return await query(sql, [coachId]);
  };
}
module.exports = new UserModel();
