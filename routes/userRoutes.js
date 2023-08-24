const { Router } = require("express");
const User=require("../models/userModel")
const bcrypt = require("bcrypt")
const userRouter = Router();
const jwt= require("jsonwebtoken")



// userRouter.post("/register", async (req, res) => {

//     console.log("coming in userroute");
//     try {
//       const { username, email, gender, password } = req.body;
//       const user = await User.findOne({ email });
//       const newPassword = await bcrypt.hash(password, 5);
//       if (!user) {
//         const newUser = await User.create({
//           email,
//           password: newPassword,
//         });
  
//         res.status(200).json({ message: "Registration succesfull" });
//       } else {
//         console.log(" presendt");
//         res.status(400).json({ message: "User is already registered" });
//       }
//     } catch (err) {
//       res.status(400).send(err.message);
//     }
//   });




userRouter.post("/register", async (req, res) => {
  console.log("coming in userroute");
  try {
    const { username, email, gender, password, avatar } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const newPassword = await bcrypt.hash(password, 5);
      const newUser = await User.create({
        username,
        email,
        avatar,
        password: newPassword,
      });
      res.status(200).json({ message: "Registration successful" });
    } else {
      console.log("present");
      res.status(400).json({ message: "User is already registered" });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});





  userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("in login", req.body);
    try {
      const user = await User.findOne({ email });
      if (user) {
        bcrypt.compare(password, user.password, (error, result) => {
          if (result) {
            var token = jwt.sign({ userId: user._id }, "rohit");    
            res.status(200).json({ msg: "User Logged in", token }); 
          } else {
            res.status(200).json({ msg: "Incorrect Password" });
          }
        });
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  module.exports = userRouter;