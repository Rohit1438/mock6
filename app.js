const express = require("express");
const { config } = require("dotenv");
const morgan = require("morgan");
const appRouter = require("./routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");

config();

const app = express();

// Middlewares
app.use(
  cors()
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

module.exports = app;
