const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const Post = require("./models/Post");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

const MONGO_URL = `mongodb+srv://Check123:Check123@cluster0.dhywk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(
  MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.get("/api/all_posts", async (req, res)=>{
  try {
    const posts= await Post.find()
    res.json(posts)
  } catch (err) {
    res.status(500).json({message: err.message});    
  }
})

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api/posts", postRoute);

app.listen(8080, () => {
  console.log("Backend server is running!");
});
