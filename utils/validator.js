const { body, validationResult } = require("express-validator");
const { NextFunction, Request, Response } = require("express");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(422).json({ errors: errors.array() });
  };
};

const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .notEmpty()
    .withMessage("Password should be present with at least 4 characters"),
];

const signUpValidator = [
  body("name").notEmpty().withMessage("Name should be present"),
  ...loginValidator,
];

module.exports = {
  validate,
  loginValidator,
  signUpValidator,
};
