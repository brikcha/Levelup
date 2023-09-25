const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");


const UserSchema = new Schema(
  {
    name: {
     type: String,
     //required: true
    },
    email: {
     type: String,
      //required: true,
      unique: true
    },
    gender: {
        type: String,
      // required: true
   },
   adress: {
     type: String,
      // required: true
    },
   birthDate: {
    // type: Date,
     type:String
      // required: true
   },
    phone: {
      type: Number,
      // required: true
   },  
  role: {
      type: String,
      // default: "user"
     enum: ["user", "admin", "coach"]
    },

   /*role: {
    type: [String],
    default: ["admin"]
},*/
    username: {
      type: String,
     // required: true
    },
     password: {
       type: String,
     //  required: true
    },
    isActive: {
      type: Boolean,
      default :false
    },
    isBanned: {
      type: Boolean,
      default: false,
    },  
     newPassword:{
      type: String,
      required: false
  },
      image:{
        type:String,
        default:null

        
      },
       cv: {
        type: String,
        default:null
        // required: true
       },
       specialite: {
        type: String,
        default:null
        // required: true
       },
    
  });


  let User = mongoose.model("user", UserSchema);

const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
    });
    return schema.validate(user);
};




module.exports = { User, validate };