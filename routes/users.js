const User = require("../models/User");
const Comment = require("../models/Comment");
const router = require("express").Router();
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//GET A USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, posts, createdAt, email, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//FOLLOW A USER
router.post("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.body.userId } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//UNFOLLOW A USER
router.post("/unfollow/:id", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.userId } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

  //LIKE A POST
router.post("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
  }} catch (err) {
    res.status(500).json(err);
  }
});

// DISLIKE A POST
router.post("/unlike/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
  }} catch (err) {
    res.status(500).json(err);
  }
});

//COMMENT ON A POST
router.post("/comment/:id", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    const post = Post.findById(req.params.id);
    await post.updateOne({ $push: { comments: savedComment } });
    const {userId, desc, createdAt, updatedAt, ...others} = savedComment._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ALL POSTS
router.get("/c/all_posts", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: req.body.userId });
    res.json(userPosts)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
