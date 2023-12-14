const express = require("express");
const form = require("../models/Forms");
const auth = require("../middleware/authMiddleware");
const question = require("../models/Questions.js");
const SubmittedData=require("../models/Answers.js")
const User = require("../models/User.js");
const postRouter = express.Router();


postRouter.get("/", auth, async (req, res) => {
  try {
    const forms = await form.find({ user: req.body.userID });
    if (forms.length === 0) {
      return res.status(200).json({ message: "forms not found" });
    }
    res.status(200).json({ forms });
  } catch (err) {
    res.status(400).send(err.message);
  }
});



// POST route to add a new form
postRouter.post("/addforms", auth, async (req, res) => {
  try {
    console.log("trying")
    const { title, userID } = req.body;

    // You can use userID to associate the form with the authenticated user
    const newform = new form({
      title,
      user: userID,
      lastUpdated: Date.now(),
    });

    const savedform = await newform.save();
    res.status(201).json(savedform);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.get('/questions/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;

    // Check if the form exists
    const formExists = await form.exists({ _id: formId, user: req.body.userID });
    if (!formExists) {
      return res.status(404).json({ message: 'form not found' });
    }

    // Retrieve questions for the specified form
    const questions = await question.find({ form: formId });
    const formName=await form.find({_id:formId})

    if (questions.length === 0) {
      return res.status(200).json({formName:formName[0].title, message: 'questions not found for the form' });
    }

    res.status(200).json({formName:formName[0].title, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



postRouter.get('/questionsforsubmission/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
console.log(formId);
    // Check if the form exists
    const formExists = await form.exists({ _id: formId });
    if (!formExists) {
      return res.status(404).json({ message: 'form not found' });
    }

    // Retrieve questions for the specified form
    const questions = await question.find({ form: formId });
    const formName=await form.find({_id:formId})
console.log(formName,"formname");
    if (questions.length === 0) {
      return res.status(200).json({formName:formName[0].title, message: 'questions not found for the form' });
    }

    res.status(200).json({formName:formName[0].title, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});










// POST route to add a new question to a form
postRouter.post("/addquestions/:formId", auth, async (req, res) => {
  try {
    console.log("coming")
    const { title, description,options,questionType,answer } = req.body;
    const formId = req.params.formId;

    // Check if the form exists (you may want to add more validation)
    const formExists = await form.exists({ _id: formId });
    if (!formExists) {
      return res.status(400).json({ message: "form not found" });
    }

    const newquestion = new question({
      title,
      description,
      form: formId,
      options,
      questionType,
      answer
    });

    const savedquestion = await newquestion.save();

    // Add the question to the form's questions array
    await form.findByIdAndUpdate(
      formId,
      { $push: { questions: savedquestion._id }, lastUpdated: Date.now() },
      { new: true }
    );

    res.status(201).json(savedquestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.get("/getallsubmissions/:formId", auth, async (req, res) => {
  try {
    console.log("coming")
    const { answers, userID } = req.body;
    const formId = req.params.formId;

  
    const formExists = await form.exists({ _id: formId });
    if (!formExists) {
      return res.status(400).json({ message: "form not found" });
    }
  const allSubmissions = await SubmittedData.find({ form: formId });
    // const newsubmission = new SubmittedData({
    //   user: userID ,
    //   form: formId,
    //   answers:[...answers],
    //   questionData:[...questions]
    // });

    // const savedsubmission= await newsubmission.save();
  
    // Add the question to the form's questions array
    // await SubmittedData.findByIdAndUpdate(
    //   formId,
    //   { $push: { questions: savedquestion._id }, lastUpdated: Date.now() },
    //   { new: true }
    // );

    res.status(201).json(allSubmissions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



















postRouter.post("/submitform/:formId", auth, async (req, res) => {
  try {
    console.log("coming")
    const { answers, userID } = req.body;
    const formId = req.params.formId;

  
    const formExists = await form.exists({ _id: formId });
    if (!formExists) {
      return res.status(400).json({ message: "form not found" });
    }
  const questions = await question.find({ form: formId });
    const newsubmission = new SubmittedData({
      user: userID ,
      form: formId,
      answers:[...answers],
      questionData:[...questions]
    });

    const savedsubmission= await newsubmission.save();
  
    // Add the question to the form's questions array
    // await SubmittedData.findByIdAndUpdate(
    //   formId,
    //   { $push: { questions: savedquestion._id }, lastUpdated: Date.now() },
    //   { new: true }
    // );

    res.status(201).json(savedsubmission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// DELETE route to delete an question
postRouter.delete("/deletequestions/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Check if the question exists (you may want to add more validation)
    const questionExists = await question.exists({ _id: questionId });
    if (!questionExists) {
      return res.status(400).json({ message: "question not found" });
    }

    // Find the form that contains the question
    const form = await form.findOne({ questions: questionId });

    // Remove the question from the form's questions array
    form.questions.pull({ _id: questionId });
    await form.save();

    // Delete the question
    await question.findByIdAndDelete(questionId);

    res.status(200).json({ message: "question deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE route to update an question
postRouter.put("/updatequestion/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { title, description } = req.body;
console.log(title,description,questionId,"here");
    // Check if the question exists (you may want to add more validation)
    const questionExists = await question.exists({ _id: questionId });
    if (!questionExists) {
      return res.status(400).json({ message: "question not found" });
    }

    // Update the question
    const updatedquestion = await question.findByIdAndUpdate(
      questionId,
      { title, description },
      { new: true }
    );
console.log(title,description)
    res.status(200).json(updatedquestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// postRouter.get("/get/:postID", async (req, res) => {
//     const  postID  = req.params.postID;
//     console.log(postID)
//     try {
//       const post = await Post.findOne({ _id: postID });
//       // console.log(recipe);
//       if (post) {
//         return res.status(200).json({ Messsage: "post",post});
//       } else {
//         return res.status(404).json({ msg: `movie not found...!!` });
//       }
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   });




// postRouter.get("/oem", async (req, res) => {
//     try {
//       const post = await OEM.find({ });
//       // console.log(recipe);
//       if (post) {
//         return res.status(200).json({ Messsage: "OEM",post});
//       } else {
//         return res.status(404).json({ msg: `car data not found...!!` });
//       }
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   });

//   postRouter.get("/oem/:postID", async (req, res) => {
//     const  postID  = req.params.postID;
//     console.log(postID)
//     try {
//       const post = await OEM.findOne({ _id: postID });
//       // console.log(recipe);
//       if (post) {
//         return res.status(200).json({ Messsage: "post",post});
//       } else {
//         return res.status(404).json({ msg: `movie not found...!!` });
//       }
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   });

//   postRouter.post("/oem/add",  async (req, res) => {
//     try {
//       const {
//         name,
//         year,
//         price,
//         availableColors,
//         mileage,
//         power,
//         maxSpeed,
//       } = req.body;
// console.log(req.body)
      
//       const newOEMData = {
//         name,
//         year,
//         price,
//         availableColors,
//         mileage,
//         power,
//         maxSpeed
     
//       };
//       const newOEM = new OEM(newOEMData);
//       await newOEM.save();
  
//       return res.status(201).json({ Message: "OEM data added", newOEM });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   });







postRouter.post("/add", auth, async (req, res) => {

  try {
    const {
   title,
   description,
   questions,
   lastUpdated
    } = req.body;
    // console.log(req.body,"byyy")
    const createdBy = req.body.userID;
    // console.log(req.body,"bodyyyy")
    // console.log(createdBy, "cretor");
    const newPostData = {
      title,
      description,
      questions,
      lastUpdated,
    
      // createdAt: formatDate(Date.now()),
      createdBy:user
    };
    const newPost = await Post(newPostData);
    await newPost.save();
    // await createdBy.populate()
    return res.status(200).json({ msg: "New car added", newPost });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



// postRouter.delete("/:postID", auth, async (req, res) => {
//     const { postID } = req.params;
//     const post = await Post.findOne({ _id: postID });
//     console.log(post,"finded")
//     try {
//       if (post) {
//         const deletedPost = await Post.findByIdAndDelete({
//           _id: postID,
//         });
//         return res.status(200).json({ msg: "Car deleted", deletedPost});
//       } else {
//         return res.status(404).json({ msg: `car not found...!!` });
//       }
//     } catch (error) {
//         console.log*error
//       return res.status(500).json({ error: error.message });
//     }
//   });

//   postRouter.get("/inventory",auth, async (req, res) => {
//     const  userID  = req.body.userID;
  
//     try {
//       const post = await Post.find({ createdBy: userID });
//       // console.log(recipe);
//       if (post) {
//         return res.status(200).json({ Messsage: "post",post});
//       } else {
//         return res.status(404).json({ msg: `car not found...!!` });
//       }
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   });



module.exports = postRouter;
