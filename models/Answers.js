// const mongoose = require("mongoose");

// const answerSchema = new mongoose.Schema({
//   question: {
//     type: String,
//     required: true,
//   },
//   answer: {
//     type: String,
//     required: true,
//   },
//   project: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Project',
//     required: true,
//   },
//   lastUpdated: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = mongoose.model("Answers", answerSchema);



const mongoose = require('mongoose');

const submittedDataSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form' 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the user who submitted the form (if applicable)
  },

  answers:{type:String}
  ,
  questionData: [
    // {
    //   questionId: mongoose.Schema.Types.ObjectId, 
    //   answer: String 
    // }
  
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const SubmittedData = mongoose.model('SubmittedData', submittedDataSchema);

module.exports = SubmittedData;
