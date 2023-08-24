const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String },
  likes: { type: Array },
  comment: { type: Array},
});

const blogModel = mongoose.model("blogs", blogSchema);
module.exports = blogModel;




