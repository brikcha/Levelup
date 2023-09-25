const UserModel = require("../models/user");
const PostModel = require("../models/post.model");
const { docs } = require("googleapis/build/src/apis/docs");
const postModel = require("../models/post.model");
const { date } = require("joi");
const { json } = require("body-parser");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;

//read all posts
module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to ge data : " + err);
  });
};

//delete post model
module.exports.deletePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id unknown:" + req.params.id);
  postModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.status(200).send(docs);
    else console.log("delete failed:" + err);
  });
};
//like post
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
//unlike post
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
//incrementer comment
module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
//editer comment 
module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) => //
        comment._id.equals(req.body.commentId)
      );

      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return docs.save((err) => { // mayelzmch bel s
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

//create

module.exports.createPost = async (req, res) => {
  console.log(req.body);
  console.log("sssss", req.files[0]);
  const newPost = new PostModel({
    title: req.body.title,
    message: req.body.message,
    posterId: req.body.posterId,
    picture: req.files[0].filename,
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
//update postnpm start
module.exports.updatesPost = async (req, res) => {
  // console.log("sssss", req.files[0]);
  // const newPost = new PostModel({
  //   title: req.body.title,
  //   message: req.body.message,
  //   posterId: req.body.posterId,
  //   picture: req.files[0].filename,
  // });

  try {
    _id = req.params.id;
   let requestResult = await PostModel.findByIdAndUpdate(req.params.id, { $set: req.body });
    return res.status(201).json(requestResult);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//delete comments -hh
module.exports.deleteCommentPost = async (req, res) => {
 
  try {
    let resul = await PostModel.updateOne(
      { _id: req.params.id},
      { $pull: { comments: { _id: req.body._id } } }
    );
    res.send(resul);
  } catch (err) {
    return res.status(400).send(err);
  }
};
//addCommentToPost -hh
module.exports.addCommentToPost = async (req, res) => {
  if (!ObjectId.isValid(req.params["id"]))
    return res.status(400).send("Id unknown:", req.params["id"]);
  if (!req.body.text) {
    return res.status(400).send("please insert a comment");
  } else if (!req.body.commenterId) {
    return res.status(400).send("userid is missinf");
  } else {
    let idd = await req.params["id"];
    try {
      let commentaireID = await PostModel.findById(idd);
      let addComment = await PostModel.findByIdAndUpdate(
        commentaireID._id,
        {
          $push: {
            comments: {
              commenterId: req.body.commenterId,
              commenterPseudo: req.body.commenterPseudo || "annonyme",
              text: req.body.text,
              timestamp: Date.now(),
            },
          },
        },
        { upsert: true, new: true }
      );
      res.send(addComment);
    } catch (error) {
      console.log("first", error);
      res.send(error);
    }
  }
};

//addLikeToPost -hh
module.exports.addLikeToPost = async (req, res) => {
  if (!ObjectId.isValid(req.params["id"]))
    return res.status(400).send("Id unknown:", req.params["id"]);
  if (!req.body.likerId) {
    return res.status(400).send("userid is missing");
  } else {
    let idd = await req.params["id"];
    try {
      let testifalreadylikeit = await PostModel.find({
        $and: [
          { _id: { $eq: idd } },
          { likers: { $elemMatch: { likerId: { $eq: req.body.likerId } } } },
        ],
      });
      if (testifalreadylikeit.length === 0) {
        let likerID = await PostModel.findById(idd);
        let addComment = await PostModel.findByIdAndUpdate(
          likerID._id,
          {
            $push: {
              likers: {
                likerId: req.body.likerId,
                ifLike: req.body.ifLike,
              },
            },
          },
          { upsert: true, new: true }
        );
        res.send(addComment);
      } else {
        res.send("you are like this post already");
      }
    } catch (error) {
      console.log("first", error);
      res.send(error);
    }
  }
};
//update comment
module.exports.updateCommentFn = async (req,res) => {
  let idd = await req.params["id"];
   var arr = [];
  try {
     let testifalreadylikeit = await PostModel.update(
 
         { _id: { $eq: idd }, "comments._id": req.body.commentId },
       { $set: { 'comments.$.text':req.body.text } }
      
     );
    // if (testifalreadylikeit) {
    
    //   let newComments = await testifalreadylikeit[0].comments;
     
    //   await newComments.forEach((element, index) => {
    //     // console.log("sssssss", element._id.toString());
    //     if (element._id.toString() === req.body.commentId) {
    //       element.text = req.body.text;
    //     }
    //   });
    //   await arr.push(newComments);
    //   console.log("new comments: ", arr);

    // }
    // console.log(",arr",arr)
    // // the update 
    // let last = await PostModel.findOneAndUpdate(
    //   { _id: idd },
    //   { $set: { comments: arr } }
    // );
    res.send(testifalreadylikeit);
    console.log(testifalreadylikeit);
  } catch (error) {
    res.send(error);
  }
}

/********************/ 

//read  only the post of connected user 
module.exports.readPost = (req, res) => { 
  const userId = req.params.userId;
  PostModel.find({ userId: userId }, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log('Erreur lors de la récupération des données: ' + err);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });
};



// count poster_id 
module.exports.countUserPosts = async (req, res) => {
  const posterId = req.params.posterId;
  try {
    const count = await PostModel.countDocuments({ posterId: posterId });
    return res.status(200).json({ count: count });
  } catch (err) {
    return res.status(400).send(err);
  }
};

// count comments 
module.exports.countUserCommentsFn = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await PostModel.countDocuments({ user: userId });
    res.send(`User ${userId} has created ${count} comments`);
    console.log(`User ${userId} has created ${count} comments`);
  } catch (error) {
    res.send(error);
  }
};
// count likes 
module.exports.countUserLikes = async (req, res) => {
  const userId = req.params.userId;

  try {
    const count = await PostModel.count({
      likers: { $elemMatch: { likerId: userId } },
    });
    return res.status(200).json({ count});
  } catch (err) {
    return res.status(400).send(err);
  }
};



module.exports.findpostById = async (req, res) => {
  const userId = req.params.id;

  try {
    const count = await PostModel.findById(userId);
    return res.status(200).json( count );
  } catch (err) {
    return res.status(400).send(err);
  }
};
