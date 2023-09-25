const mongoose = require("mongoose");

const CoursSchema = new mongoose.Schema({
  titre: {
    type: String,
    // required: true
  },
  type : {
    type: String,
    // required: true, 
  },
  image:{
    type:String,
    default:null
  },
  description: {
    type: String,
    // required: true
  },
  CoursHeure: {
    type: String,
    // required: true
  },

  subscribers: [{ type: mongoose.ObjectId, ref: "user" }],
  
  rating: {
    type: [Number],
    validate: {
      validator: function(val) {
        if (val.length > 0) {
          const isValid = val.every((rating) => rating >= 1 && rating <= 4);
          return isValid;
        }
        return true;
      },
      message: 'Ratings must be between 1 and 4',
    },
  },
  
   
  averageRating: {
    type: Number,
    default: null
  },
  coach: {
    type: mongoose.ObjectId ,
    ref: "user",
    //required:true
    
  },
  coachName:{
    type:String,
    },

  coachImage:{
      type:String,
    }
  

});



CoursSchema.pre("save", function (next) {
  if (this.rating.length > 0) {
    const sum = this.rating.reduce((a, b) => a + b, 0);
    this.averageRating = sum / this.rating.length;
  } else {
    this.averageRating = null;
  }
  next();
});



module.exports = mongoose.model("Cours", CoursSchema);
