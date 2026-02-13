const { body } = require("express-validator");

const registerValidation = [
  body("fullname")
    .isEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be 3 character"),
  body("email")
    .isEmpty()
    .withMessage("email is required")
    .matches(/@gmail\.com$/)
    .withMessage("Only Gmail allowed"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character or digit or symbol"),

  body("role")
    .optional()
    .isIn(["user", "provider", "admin"])
    .withMessage("Invalid role"),
];




module.exports = {
    registerValidation
}