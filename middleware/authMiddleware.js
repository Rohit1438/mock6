const jwt = require("jsonwebtoken");
// const BlacklistModel = require("../model/blacklist.model");
// require("dotenv").config();

// const auth = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
// console.log(token)
//   try {
//     if (token) {
//     //   let existingToken = await BlacklistModel.find({
//     //     blacklist: { $in: token },
//     //   });
//       // if (existingToken.length) {
//       //   return res.status(400).json({ error: "Please Login Again..!!!" });
//       // }
      
//       const decoded = jwt.verify(token, "rohit");
//       req.body.userID = decoded.userID;
//       console.log("going to call")
//       req.body.username = decoded.username;
//       next();
//     } else {
//       return res
//         .status(201)
//         .json({ msg: "not authorised to do this operation" });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// module.exports = auth;



// ... (other imports)

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

