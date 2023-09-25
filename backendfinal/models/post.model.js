const { boolean } = require("joi");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    likers: {
      type: [{
        likerId:String,
        ifLike:{type:Boolean}
      }],
      required: true,
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", PostSchema);

// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;
// const forumSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   body: {
//     type: String,
//     required: true,
//   },
//   photo: {
//     data: Buffer,
//     contentType: String,
//   },
//   postedBy: {
//     type: ObjectId,
//     ref: "user",
//   },
//   created: {
//     type: Date,
//     default: Date.now,
//   },
//   updated: Date,
//   likes: [
//     {
//       type: ObjectId,
//       ref: "user",
//     },
//   ],
//   Comments: [
//     {
//       text: String,
//       created: { type: Date, default: Date.now },
//       postedBy: { type: ObjectId, ref: "user" },
//     },
//   ],
// });
// module.exports = mongoose.model("Forum", forumSchema);
