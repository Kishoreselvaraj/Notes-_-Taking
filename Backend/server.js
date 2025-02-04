const express=require("express");
const dotenv=require("dotenv");
const path = require("path");
const cors=require("cors");
const {connectToMongo}=require("./Database/connectDB");
const user=require("./Router/user.router");
const note=require("./Router/note.router");
dotenv.config();
connectToMongo();
const app=express();
app.use(express.json());
const PORT=3000;
app.use(cors({
    origin: "http://localhost:5173",  // Adjust to your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use("/admin",user);
app.use("/create",note);

  
  
app.listen(PORT,()=>{
    
    console.log(`Server Started on port :${PORT}`);
});