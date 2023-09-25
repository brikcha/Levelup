const Gym = require("../models/gym.model");
const path = require("path");

// GET all gyms
const getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.json(gyms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one gym
const getOneGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (gym == null) {
      return res.status(404).json({ message: "Gym not found" });
    }
    res.json(gym);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE a gym
const createGym = async (req, res) => {
  const imagePath = req.files["image"][0].originalname;
  const videoPath = req.files["video"][0].originalname;
  console.log(videoPath);

  const gym = new Gym({
    name: req.body.name,
    location: req.body.location,
    capacity: req.body.capacity,
    phone: req.body.phone,

    description: req.body.description,
    image: imagePath, // Add this line to store the file path in the database
    video: videoPath,
  });

  try {
    const newGym = await gym.save();

    // Twilio SMS code
   /* var sid = "AC0630737295a661bd5ff7ed8dffbc1c22";
    var auth_token = "2f60ff9d44b3ae263355c6c997faa7e1";

    var twilio = require("twilio")(sid, auth_token);

    const phoneNumbers = ["+21656374634", "+21652541994"]; // replace with your phone numbers

    phoneNumbers.forEach((phoneNumber) => {
      twilio.messages
        .create({
          from: "+16202979674",
          to: phoneNumber,
          body: `New gym created: ${newGym.name}`,
        })
        .then(function (res) {
          console.log("SMS message sent to " + phoneNumber + "!");
        })
        .catch(function (err) {
          console.log(err);
        });
    });*/
    res.status(201).json(newGym);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// UPDATE a gym
const updateGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (gym == null) {
      return res.status(404).json({ message: "Gym not found" });
    }
    if (req.body.name != null) {
      gym.name = req.body.name;
    }
    if (req.body.location != null) {
      gym.location = req.body.location;
    }
    if (req.body.capacity != null) {
      gym.capacity = req.body.capacity;
    }
    if (req.body.phone != null) {
      gym.phone = req.body.phone;
    }
    if (req.body.description != null) {
      gym.description = req.body.description;
    }
    
    if (req.files && req.files["image"]) {
      gym.image = req.files["image"][0].originalname;
    }
    if (req.files && req.files["video"]) {
      gym.video = req.files["video"][0].originalname;
    }
    const updatedGym = await gym.save();
    res.json(updatedGym);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a gym
const deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (gym == null) {
      return res.status(404).json({ message: "Gym not found" });
    }
    await gym.remove();
    res.json({ message: "Gym deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like a gym
const likeGym = async (req, res) => {
  try {
    const { userId } = req.body;
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    res.json(gym);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike a gym
const unlikeGym = async (req, res) => {
  try {
    const { userId } = req.body;
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );
    res.json(gym);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllGyms,
  getOneGym,
  likeGym,
  unlikeGym,
  createGym,
  updateGym,
  deleteGym,
};
