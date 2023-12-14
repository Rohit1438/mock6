const mongoose = require("mongoose");


// {
//   "questionType":"comprehension",
//   "title":"Question 1",
//   "description":"abcdefgh",
//   "answer":"bcd"
// }




// {
//   "questionType":"cloze",
//   "title":"Question bc 3 is  ",
//   "options":["ab","bc","de","bcd"],
//   "answer":"bcd"
// }


const questionSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Forms",
    required: true,
  },
  questionType:{type:String}
,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  options: [],
  answer: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Questions", questionSchema);
