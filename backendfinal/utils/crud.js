const { User } = require("../models/user");
const { Auth } = require("../utils/Auth");
const jwt = require("jsonwebtoken");
const auth= require("../controllers/authController");
/*const user_update = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body},
        function (err, user) {
            if (err) return next(err);
            res.send('User is updated.');
        });
};*/

//update with token
//update with token
const user_update = function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const _id = req.params.id;
  const { name, birthDate } = req.body;

  // Check if a file was uploaded
  let imagePath = null;
  if (req.files && req.files[0]) {
    imagePath = `/uploads/${req.files[0].filename}`;
  }

  // Create an update object with the fields to be updated
  const updateObject = {};
  if (name) {
    updateObject.name = name;
  }
  if (birthDate) {
    updateObject.birthDate = birthDate;
  }
  if (imagePath) {
    updateObject.image = imagePath;
  }

  // Update the user document
  User.findByIdAndUpdate(
    _id,
    { $set: updateObject },
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
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
const userinfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedToken",decodedToken)
    console.log(req.params, "param");
    const userId = req.params.id;
    console.log(userId, "userId");
    const user = await User.findOne({ email:  decodedToken.UserInfo.email });
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching your user information",
    });
  }
};

const banUserAccount = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.UserInfo.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to ban users" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isBanned) {
      return res.status(400).json({ error: "User is already banned" });
    }
    user.isBanned = true;
    await user.save();
    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//UnBan user with token
const unBanUserAccount = function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (decodedToken.UserInfo.role == "admin") {
    _id = req.params.id;
    User.findByIdAndUpdate(
      _id,
      { $set: { isBanned: false } },

      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
          res.send("user Unbanned successfully");
        }
      }
    );
  } else {
    res.send("you are not authorized to ban");
  }
};

//delete account hajer

const deleteUserAccount = function (req, res) {
  console.log(req, " req ");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);;
    if (decodedToken.UserInfo.role == "admin") {
    const userId = req.params.id;
    User.findByIdAndDelete(userId, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      } else if (!docs) {
        console.log("User not found");
        res.status(404).json({ error: "User not found" });
      } else {
        console.log("Deleted User : ", docs);
        res.status(200).json({ message: "User deleted successfully" });
      }
    });
  } else {
    res
      .status(401)
      .json({ error: "You are not authorized to delete user accounts" });
  }
};


module.exports = {
  user_delete,
  user_update,
  getbyrole,
  desactivate,
  unBanUserAccount,
  banUserAccount,
  deleteUserAccount,
  userinfo
  
};
