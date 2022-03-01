const mongoose = require("mongoose");

// THIS IS THE MONGOOSE SCHEMA FOR COMMENTS
const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments",CommentSchema);
