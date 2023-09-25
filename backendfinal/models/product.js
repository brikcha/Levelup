const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  category: {
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
  rating: {
    type: [Number],
    validate: {
      validator: function(val) {
        if (val.length > 0) {
          const isValid = val.every((rating) => rating >= 1 && rating <= 5);
          return isValid;
        }
        return true;
      },
      message: 'Ratings must be between 1 and 5',
    },
  },
  quantity: {
    type: Number,
    // required: true
  },  
  price: {
    type: Number,
    // required: true
  },  
  stock :{
    type : Number ,
    // required: true
  },
  averageRating: {
    type: Number,
    default: null
  }
});

ProductSchema.pre("save", function (next) {
  if (this.rating.length > 0) {
    const sum = this.rating.reduce((a, b) => a + b, 0);
    this.averageRating = sum / this.rating.length;
  } else {
    this.averageRating = null;
  }
  next();
});


module.exports = mongoose.model("Product", ProductSchema);
