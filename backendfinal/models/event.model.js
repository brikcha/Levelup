/*const mongoose = require('mongoose');
const { User } = require('./user');
const Cours = require('./Cours');

const EventSchema  = new mongoose.Schema({
    title:{
        type:String
    },
    event_date:{type:Date,required:true},
    cours: {type:mongoose.ObjectId, ref:Cours, required:true},
    createdBy: {type:mongoose.ObjectId, ref:User, required:true},
});

let Event = mongoose.model("Events",EventSchema)

module.exports = {Event};*/

const mongoose = require('mongoose');
//const { User } = require('./user');
const Cours = require('./Cours');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  event_date: {
    type: Date,
    required: true
  },
  cours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cours',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  onlinesession:{
    type:String
  }
  
});

const Event = mongoose.model('Event', EventSchema);

module.exports = { Event };
