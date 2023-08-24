const jwt = require("jsonwebtoken");
// 
const { BlacklistModel } = require("../models/blacklistmodel");

const auth = async (req, res, next) => {

  const token = req.headers.authorization.split(" ")[1];
  console.log("token")
  try {
    // let existingToken = await BlacklistModel.find({
    //   blacklist: { $in: token },
    // });
    // if (existingToken) {
    //   res.status(200).json("Login!!");
    // } else {
      const decoded = jwt.verify(token, "rohit");
      req.userId=decoded.userId
    req.username=decoded.username
      console.log("next is calling")
      next();
    // }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports =  auth ;
