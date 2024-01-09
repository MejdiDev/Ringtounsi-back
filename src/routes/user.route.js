const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const {
  createUserSchema,
  updateUserSchema,
  validateLogin,
} = require("../middleware/validators/userValidator.middleware");
router.get("/", awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users

//router.get("/", auth(), awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users
router.get("/id/:id", auth(), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
router.get(
  "/username/:username",
  auth(),
  awaitHandlerFactory(userController.getUserByuserName)
); // localhost:3000/api/v1/users/usersname/wajdi
router.get(
  "/whoami",
  auth(),
  awaitHandlerFactory(userController.getCurrentUser)
); // localhost:3000/api/v1/users/whoami
router.post(
  "/",
  createUserSchema,
  awaitHandlerFactory(userController.createUser)
); // localhost:3000/api/v1/users
router.patch(
  "/id/:id",
  updateUserSchema,
  awaitHandlerFactory(userController.updateUser)
); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete(
  "/id/:id",
  auth(Role.Admin),
  awaitHandlerFactory(userController.deleteUser)
); // localhost:3000/api/v1/users/id/1

router.post(
  "/login",
  validateLogin,
  awaitHandlerFactory(userController.userLogin)
); // localhost:3000/api/v1/users/login

router.post(
  "/rate-coach",
  auth(Role.Athlete),
  awaitHandlerFactory(userController.rateCoach)
);///api/v1/users/rate-coach

router.get(
  "/rate-coach/:coachId",
  auth(),
  awaitHandlerFactory(userController.getCoachRatingById)
);
///api/v1/users/coach-ratings

router.post("/add-comment",
 auth(),
  awaitHandlerFactory(userController.addCommentToCoach)
  );
  router.get("/coach-comments/:coachId", 
  auth(), 
  awaitHandlerFactory(userController.getCoachComments));


module.exports = router;
