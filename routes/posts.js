const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//CREATE A POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const user = User.findById(req.body.userId);
    await user.updateOne({ $push: { posts: savedPost } });
    const {likes,updatedAt,userId, comments, ...others} = savedPost._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE A POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      const user = User.findById(req.body.userId);
      await user.updateOne({ $pull: { posts: post } });
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET A POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const{userId, title, description, updatedAt, createdAt, ...others} = post._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
