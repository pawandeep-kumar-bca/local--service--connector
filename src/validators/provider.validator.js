const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

const providerValidator = [
  body("providerName")
    .notEmpty()
    .withMessage("Provider name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Provider name must be between 3 and 50 characters")
    .trim(),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("experience")
    .notEmpty()
    .withMessage("Experience is required")
    .isNumeric()
    .withMessage("Experience must be a number"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City name must be valid")
    .trim(),

  body("documents.aadharCard")
    .notEmpty()
    .withMessage("Aadhar card is required"),

  body("documents.certificate")
    .notEmpty() 
    .withMessage("Certificate is required"),

  respondWithValidationErrors,
];


const providerUpdateValidator = [
  body("providerName")
    .optional()
    .withMessage("Provider name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Provider name must be between 3 and 50 characters")
    .trim(),

  body("phoneNumber")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("price")
.optional()
    .isNumeric()
    .withMessage("Price must be a number"),

  body("experience")
    .optional()
    .isNumeric()
    .withMessage("Experience must be a number"),

  body("city")
  .optional()
    .isLength({ min: 2 })
    .withMessage("City name must be valid")
    .trim(),

  respondWithValidationErrors,
];
module.exports = {
 providerUpdateValidator ,
  providerValidator,
};
