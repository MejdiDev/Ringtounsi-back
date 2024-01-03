const { body } = require("express-validator");
const Role = require("../../utils/userRoles.utils");

exports.createUserSchema = [
  body("nom")
    .exists()
    .withMessage("Your nom is required")
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("prenom")
    .exists()
    .withMessage("Your prenom is required")
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .isLength({ max: 10 })
    .withMessage("Password can contain max 10 characters"),
  body("confirm_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
  body("role")
    .optional()
    .isIn([Role.Admin, Role.Coach, Role.Athlete])
    .withMessage("Invalid Role type"),
];

exports.updateUserSchema = [
  body("nom")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("prenom")
    .optional()
    .isAlpha()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("role")
    .optional()
    .isIn([Role.Admin, Role.Coach, Role.Athlete])
    .withMessage("Invalid Role type"),
  body("password")
    .optional()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .isLength({ max: 10 })
    .withMessage("Password can contain max 10 characters")
    .custom((value, { req }) => !!req.body.confirm_password)
    .withMessage("Please confirm your password"),
  body("confirm_password")
    .optional()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "confirm_password field must have the same value as the password field"
    ),
    body("bio")
    .optional()
    .custom((value, { req }) => value === req.body.bio)
    .withMessage(
      "bio"
    ),
    body("adresse")
    .optional()
    .custom((value, { req }) => value === req.body.adresse)
    .withMessage(
      "adr"
    ),
    body("grade")
    .optional()
    .custom((value, { req }) => value === req.body.grade)
    .withMessage(
      "grade"
    ),
    body("numTel")
    .optional()
    .custom((value, { req }) => value === req.body.numTel)
    .withMessage(
      "phone"
    ),
  body()
    .custom((value) => {
      return !!Object.keys(value).length;
    })
    .withMessage("Please provide required field to update")
    .custom((value) => {
      const updates = Object.keys(value);
      const allowUpdates = [
        "nom",
        "prenom",
        "email",
        "password",
        "confirm_password",
        "date_inscription",
        "role",
        "bio",
        "adresse",
        "grade",
        "numTel",
      ];
      return updates.every((update) => allowUpdates.includes(update));
    })
    .withMessage("Invalid updates!"),
];

exports.validateLogin = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password must be filled"),
];
