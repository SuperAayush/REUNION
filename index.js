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

const CONNECTION_URL = 'mongodb+srv://Check123:Check123@cluster0.dhywk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 8080;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.get("/api/all_posts", async (req, res)=>{
  try {
    const posts= await Post.find();
    res.json(posts)
  } catch (err) {
    res.status(500).json({message: err.message});    
  }
})

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api/posts", postRoute);


