// {
//   "title":"Form 4"
  
// }
const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions",
      },
      // questionTitle: String,
      // inputType: String,
      // options: [String],

  


    },

  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Forms = mongoose.model("Forms", formSchema);

module.exports = Forms;
