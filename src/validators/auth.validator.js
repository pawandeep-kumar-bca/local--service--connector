const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidation = [
  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .matches(/@gmail\.com$/)
    .withMessage("Only Gmail allowed"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["user", "provider", "admin"])
    .withMessage("Invalid role"),

  respondWithValidationErrors,
];

const loginUserValidation = [
  body("email").notEmpty().withMessage("email is required").isEmail().withMessage("Invalid email address"),
  body("password")
  .notEmpty().withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
     respondWithValidationErrors
  
];

module.exports = {
  registerUserValidation,
  loginUserValidation
};
