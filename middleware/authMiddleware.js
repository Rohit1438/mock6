const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (token) {
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // req.user = {
      //   userID: decoded.userID,
      //   username: decoded.username,
      // };
// console.log(decoded,"ttokkk")
      req.body.userID = decoded.id;
// console.log(req.body.userID,decoded.id)
      next();
    } else {
      return res.status(401).json({ msg: "Not authorized to perform this operation" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = auth;

