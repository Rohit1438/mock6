const express=require("express")
const mongoose=require("mongoose")

const cors = require("cors"); 
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes")
const app = express();
app.use(express.json());
app.use(cors());
const connection=async()=>{
try{
    await mongoose.connect("mongodb+srv://Rohit2002:20022003@cluster0.riuail2.mongodb.net/mock6?retryWrites=true&w=majority")

console.log("Connected to mongoose")
}catch(err){
    console.log(err)
}
}
app.get("/",(req,res)=>{
    res.send("welcome to homepage of the backend server")

})
app.use("/api",userRouter)
app.use("/api",blogRouter)
app.listen(8080,async()=>{
console.log("server is connecting")
await connection()
console.log("connected to backend")

})

