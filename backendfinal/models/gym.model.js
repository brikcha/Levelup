const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GymSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  likes: [{ type: mongoose.ObjectId, ref: "user" }],
});

const Gym = mongoose.model("Gym", GymSchema);

module.exports = Gym;
