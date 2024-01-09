const UserModel = require("../models/user.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class UserController {
  getAllUsers = async (req, res, next) => {
    let userList = await UserModel.find();
    if (!userList.length) {
      throw new HttpException(404, "Users not found");
    }

    userList = userList.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.send(userList);
  };

  getUserById = async (req, res, next) => {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
  };

  getUserByuserName = async (req, res, next) => {
    const user = await UserModel.findOne({ nom: req.params.username });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
  };

  getCurrentUser = async (req, res, next) => {
    const { password, ...userWithoutPassword } = req.currentUser;

    res.send(userWithoutPassword);
  };

  createUser = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const { role } = req.body;
    let status = "";

    if (role === "Coach") {
      status = "pending"; // If the role is coach, set status as pending
    } else {
      status = "approved"; // For other roles, set status as approved
    }

    const result = await UserModel.create({ ...req.body, status });

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("User was created!");
  };

  updateUser = async (req, res, next) => {
    this.checkValidation(req);
    await this.hashPassword(req);
    const { confirm_password, ...restOfUpdates } = req.body;

    const result = await UserModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "User not found");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "User not found"
      : affectedRows && changedRows
      ? "User updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteUser = async (req, res, next) => {
    const result = await UserModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(404, "User not found");
    }
    res.send("User has been deleted");
  };

  userLogin = async (req, res, next) => {
    this.checkValidation(req);

    const { email, password: pass } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new HttpException(401, "Unable to login!");
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new HttpException(401, "Incorrect password!");
    }

    // user matched!
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
      expiresIn: "24h",
    });

    const { password, ...userWithoutPassword } = user;

    res.send({ ...userWithoutPassword, token });
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation faild", errors);
    }
  };

  // hash password if it exists
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };

  /////
  rateCoach = async (req, res, next) => {
    this.checkValidation(req);

    const { coachId, rating } = req.body;
    const userId = req.currentUser.id; // Assuming you have the user ID in the request

    const result = await UserModel.rateCoach(userId, coachId, rating);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Coach has been rated!");
  };
  ///////////
  getCoachRatingById = async (req, res, next) => {
    try {
      const coachId = req.params.coachId;
      const coachRating = await UserModel.getCoachRatingById(coachId);

      if (!coachRating) {
        throw new HttpException(404, "Aucun rating de coach trouvé");
      }

      res.send(coachRating);
    } catch (error) {
      next(error);
    }
  };

  addCommentToCoach = async (req, res, next) => {
    try {
      const { coachId, comment, rating } = req.body;

      // L'ID de l'utilisateur est extrait à partir du token
      const userId = req.currentUser.id;

      const result = await UserModel.addComment({ userId, coachId, comment, rating });

      if (!result) {
        throw new HttpException(500, "Erreur lors de l'ajout du commentaire");
      }

      res.send("Commentaire ajouté avec succès !");
    } catch (error) {
      next(error);
    }
  };

  getCoachComments = async (req, res, next) => {
    try {
      const coachId = req.params.coachId;
      const comments = await UserModel.getCoachComments(coachId);

      // Manipulez les données comme vous le souhaitez avant de les renvoyer
      const formattedComments = comments.map((comment) => ({
        comment: comment.comment,
        created_at: comment.created_at,
        user: {
          nom: comment.user_nom,
          prenom: comment.user_prenom,
        },
        rating: comment.rating
      }));

      res.send(formattedComments);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UserController();
