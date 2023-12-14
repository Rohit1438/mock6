const { Router } = require("express");
const { getAllUsers, userLogin, userSignUp, verifyUser } = require("../controller/user-controller.js");
const { loginValidator, signUpValidator } = require("../utils/validator.js");
const { validate } = require("../utils/validator.js");
const { verifyToken } = require("../utils/token-manager.js");

const userRouter = Router();
userRouter.get("/", getAllUsers);
userRouter.post("/signup", validate(signUpValidator), userSignUp);
userRouter.post("/login", validate(loginValidator), userLogin);
userRouter.get("/auth-status", verifyToken, verifyUser);

module.exports = userRouter;
