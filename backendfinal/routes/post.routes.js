const router = require("express").Router();
const multer = require("multer");
const postController = require("../controllers/post.controller");



const mystorage= multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,redirect)=>{
        let date= Date.now();
        //image/pmg
        let fl=date + "." + file.mimetype.split("/")[1];
        redirect(null,fl);
        filename=fl;
    }
  })
  
  const upload= multer({storage:mystorage});
  
router.get("/", postController.readPost);
router.get("/:id", postController.findpostById);


router.post("/", upload.any("picture"),postController.createPost);
router.put("/comments/:id", postController.addCommentToPost);
router.put("/:id", postController.updatesPost);
router.put("/likes/:id", postController.addLikeToPost);
router.delete("/:id", postController.deletePost);

router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);

//// commentaires
//incrementer commentaire
router.patch("/comment-post/:id", postController.commentPost);
//editer un commentaire
router.patch("/editpost/:id", postController.updateCommentFn);
router.put("/deletecomment/:id",postController.deleteCommentPost);


// count posts like comments 
router.get("/posts/count/:posterId", postController.countUserPosts);
router.get("/user/:userId/comments/count", postController.countUserCommentsFn);
router.get("/likes/:userId", postController.countUserLikes);





// const router = require("express").Router();
// const jwt = require("jsonwebtoken");
// const { User } = require("../models/user");
// const Token = require("../models/token");
// const { createPost } = require("../utils/forum");
// const forum  = require('../utils/forum');

// router.post("/posts", forum.createPost);

// //router.get("/allPost", forum.allPost);

 module.exports = router;

 