const { User } = require("../models/user");
const { Auth } = require("../utils/Auth");
const jwt = require("jsonwebtoken");

/*const user_update = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body},
        function (err, user) {
            if (err) return next(err);
            res.send('User is updated.');
        });
};*/

//update with token
const user_update = function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "qwertyuiop");
  _id = req.params.id;
  User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body, image: __filename },
    function (err, user) {
      if (err) return next(err);
      res.send("User is updated.");
    }
  );
};

/*const user_delete = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted User'+req.params.id+'succesfully')
    })
};*/

// delete with token
const user_delete = function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "qwertyuiop");
  const userId = decodedToken.userId;
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send("Deleted User" + req.params.id + "succesfully");
  });
};

/*const desactivate = function (req, res){
    _id=req.params.id
    User.findByIdAndUpdate(_id, { $set:{isActive:false} },
    function (err,docs) {
if (err){
console.log(err)
}
else{
console.log("Updated User : ",docs );
res.send('user desactivated')
}
})};*/

//desactivate with token
const desactivate = function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "qwertyuiop");
  _id = req.params.id;
  User.findByIdAndUpdate(
    _id,
    { $set: { isActive: false } },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
        res.send("user desactivated");
      }
    }
  );
};

// get by role
const getbyrole = function (req, res) {
  role = req.params.role;
  User.find({ role: role })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
};

//hajer

const banUser = async (req, res) => {
  console.log("1");
  try {
    const USER = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isBanned: true } }
    ).exec();
    res.status(200).send({ message: "User banned", USER });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong !" });
  }
};

//desactivate with token
const banUserAccount = function (req, res) {
  console.log(req, ' req ')
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "qwertyuiop");

  
  _id = req.params.id;
  User.findByIdAndUpdate(
    _id,
    { $set: { isBanned: true } },

    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
        res.send("user banned");
      }
    }
  );
};

const unbanUser = async (req, res) => {
  try {
    const USER = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isBanned: false } }
    ).exec();
    res.status(200).send({ message: "User unbanned", USER });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong !" });
  }
};

module.exports = {
  user_delete,
  user_update,
  getbyrole,
  desactivate,
  banUser,
  banUserAccount,
  unbanUser,
};
