
const User = require("../models/User.js");
const { compare, hash } = require("bcrypt");
const { createToken } = require("../utils/token-manager.js");
const { COOKIE_NAME } = require("../utils/constants.js");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({ message: "OK", users });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: "Error", cause: err.message });
  }
};

const userSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await hash(password, 14);
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (existingUser) {
      // Send a response when the user already exists
      return res.status(401).send("User already registered");
    }
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create a token and store a cookie
    // Clearing the previous cookie for an already logged-in user trying to log in again 


    // res.clearCookie(COOKIE_NAME, {
    //   httpOnly: true,
    //   domain: "localhost",
    //   signed: true,
    //   path: "/",
    // });
    const token = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    // 1st argument is the name, and the 2nd is the cookie, with 3rd arguments as optional


    // res.cookie(COOKIE_NAME, token, {
    //   path: "/",
    //   domain: "localhost",
    //   expires,
    //   httpOnly: true,
    //   signed: true,
    // });

    return res
      .status(201)
      .json({ message: "User created", id: user._id.toString(), user });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: "Error", cause: err.message });
  }
};

// Login
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user,email,password);

    if (!user) {
      return res.status(401).send("User not registered");
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }
    // Clearing the previous cookie for an already logged-in user trying to log in again 
    // res.clearCookie(COOKIE_NAME, {
    //   httpOnly: true,
    //   domain: "localhost",
    //   signed: true,
    //   path: "/",
    // });
    const token = createToken(user._id.toString(), user.email, "7d");
    console.log(token);

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    // 1st argument is name and 2nd is cookie, with 3rd arguments as optional
    // res.cookie(COOKIE_NAME, token, {
    //   path: "/",
    //   domain: "localhost",
    //   expires,
    //   httpOnly: true,
    //   signed: true,
    // });
    return res
      .status(200)
      .json({ message: "User found", id: user._id.toString(),token:token, name: user.name, email: user.email });
  } catch (err) {
    return res.status(200).json({ message: "Error", cause: err.message });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    console.log("starting");
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User not registered or token malfunctioned");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission didn't match");
    }

    return res
      .status(200)
      .json({ message: "User found", id: user._id.toString(), name: user.name, email: user.email });
  } catch (err) {
    return res.status(200).json({ message: "Error", cause: err.message });
  }
};

module.exports = { getAllUsers, userSignUp, userLogin, verifyUser };
