const Cours = require('../models/Cours');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user");
const createCours = function(req, res) {
  const { titre, type, description, CoursHeure, rating, image } = req.body;
  const coachId = req.params.id;

  User.findById(coachId, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error getting coach" });
    }
    if (!user) {
      return res.status(404).json({ error: "Coach not found" });
    }

    const cours = new Cours({
      titre,
      type,
      description,
      CoursHeure,
      rating,
      image: `/uploads/${req.files[0].filename}`,
      coach: coachId,
      coachName: user.name,
      coachImage:user.image
    });

    cours.save((err, cours) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error creating cours" });
      }
      console.log("Cours created: ", cours);
      res.status(201).json({ message: "Cours created successfully" });
    });
  });
};

  
  const getCours = function(req, res) {
    // console.log(req, ' req ');
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   return res.status(401).json({ error: "Authorization header missing" });
    // }
  
    // const token = authHeader.split(" ")[1];
    // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // const userRole = decodedToken.role;
  
    // if (userRole !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to get list a product" });
    // }
    Cours.find({}, (err, cours) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error getting cours" });
      }
      res.json(cours);
    });
  };
  
  const getCoursById = function(req, res) {
    const coursId = req.params.id;
    Cours.findById(coursId, (err, cours) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error getting cours" });
      }
      if (!cours) {
        return res.status(404).json({ error: "Cours not found" });
      }
      res.json(cours);
    });
  };

  
  
  
  const evaluateCours = function(req, res) {
    const coursId = req.params.id;
    const ratingValue = req.body.rating;
  
    Cours.findById(coursId, (err, cours) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error getting cours" });
      }
      if (!cours) {
        return res.status(404).json({ error: "Cours not found" });
      }
  
      cours.rating.push(ratingValue);
      cours.save((err, cours) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error saving cours rating" });
        }
  
        // Calculate average rating
        const sum = cours.rating.reduce((acc, curr) => acc + curr, 0);
        const avgRating = sum / cours.rating.length;
  
        res.json({ message: "Cours rating updated successfully", averageRating: avgRating });
      });
    });
  };
  

  
  
  const updateCours = function(req, res) {
    //Check if user is authorized
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userRole = decodedToken.role;
    if (userRole == "coach") {
      return res
        .status(403)
        .json({ error: "You are not authorized to update a cours" });
    }
  
    // Update cours object
    const coursId = req.params.id;
    const { titre,type, description,CoursHeure } = req.body;
    const image = req.files && req.files.length > 0 ? req.files[0].filename : undefined; // Get the filename of the uploaded image
    const update = { titre, type, description, CoursHeure };
    if (image) {
        update.image = image; // Add the image filename to the update object
    }
    Cours.findByIdAndUpdate(
      coursId,
      update,
      { new: true },
      (err, cours) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error updating cours" });
        }
        if (!cours) {
          return res.status(404).json({ error: "Cours not found" });
        }
        console.log("Cours updated: ", cours);
        res.json({ message: "Cours updated successfully" });
      }
    );
};

  const deleteCours = function(req, res) {
    const coursId = req.params.id;
    
    Cours.findByIdAndDelete(coursId, function(err,cours) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error deleting product" });
      }
      
      if (!cours) {
        return res.status(404).json({ error: "Cours not found" });
      }
      
      console.log("Cours deleted: ",cours);
      res.status(200).json({ message: "Cours deleted successfully" });
    });
  };
  
  // subscribe 
/*const subscribe = async (req, res) => {
  try {
    const { userId } = req.body;
    const cours = await Cours.findByIdAndUpdate(
      req.params.id,
      { $addToSet: {  subscribers: userId } },
      { new: true }
    );
    res.json(cours);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};
  */

const subscribe = async (req, res) => { 
  try {
    const { userId } = req.body;
    const cours = await Cours.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { subscribers: userId } },
      { new: true }
    );
    res.json(cours);

    // Twilio SMS code
    const sid = "AC4d77bfcd476cb1974d174ca9a6703111";
    const auth_token = "3e3442a780e3c3eb89e38e3618690c09";

    const twilio = require("twilio")(sid, auth_token);

    const coachPhoneNumber = "+21656355907"; // replace with actual coach phone number

    twilio.messages 
      .create({
        from: "+16813256829",
        to: coachPhoneNumber,
        body: `New subscriber ${userId} has subscribed to course ${req.params.id} `,
      })
      .then(function (res) {
        console.log("SMS message sent " + coachPhoneNumber + "!");
      })
      .catch(function (err) { 
        console.log(err);
      });
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

// Unscubscribe 
const unsubscribe = async (req, res) => {
  try {
    const { userId } = req.body;
    const cours = await Cours.findByIdAndUpdate(
      req.params.id,
      { $pull: { subscribers: userId } },
      { new: true }
    );
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createCours,getCoursById,getCours,updateCours,deleteCours,evaluateCours,subscribe,
  unsubscribe
};