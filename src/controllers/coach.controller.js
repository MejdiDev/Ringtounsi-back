const UserModel = require("../models/user.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class CoachController {
  getCoachUsers = async (req, res, next) => {
    let coachList = await UserModel.find({ role: "coach" });

    if (!coachList.length) {
      throw new HttpException(404, "Coach users not found");
    }

  /*  coachList = coachList.map((coach) => {
      const {...coachWithoutPassword } = coach;
      return coachWithoutPassword;
    });*/

    res.send(coachList);
  };

  createCoachUser = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    req.body.role = "Coach"; // Set the role to "coach" specifically

    const result = await UserModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Coach user was created!");
  };

  updateCoachUser = async (req, res, next) => {
    this.checkValidation(req);

    const { ...restOfUpdates } = req.body;

    const result = await UserModel.update(restOfUpdates, req.params.id);

    if (!result) {
      throw new HttpException(404, "Coach user not found");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Coach user not found"
      : affectedRows && changedRows
      ? "Coach user updated successfully"
      : "Updated failed";

    res.send({ message, info });
  };

  deleteCoachUser = async (req, res, next) => {
    const result = await UserModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(404, "Coach user not found");
    }
    res.send("Coach user has been deleted");
  };

  // Other functions specific to coach users can be added here

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // hash password if it exists
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };
}

module.exports = new CoachController();
