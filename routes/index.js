const { Router } = require("express");
const userRouter = require("./user_route.js");
const postRouter = require("./projects_route.js");

const appRouter = Router();

// Specifying particular Routers (chat or User Router) to handle separate routes
appRouter.use("/user", userRouter);
appRouter.use("/forms", postRouter);

module.exports = appRouter;
