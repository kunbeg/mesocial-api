const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer")
const path=require("path")
dotenv.config();

app.use(cors());

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("connected to mongodb");
});

app.use("/images",express.static(path.join(__dirname,"public/images")))
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/images")
  },
  filename:(req,file,cb)=>{
    cb(null, req.body.name);
  }
})
const upload=multer({storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
  try{
    return res.status(200).json("file uploaded successfully")
  }catch(err){
    console.error(err);
  }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running");
});
