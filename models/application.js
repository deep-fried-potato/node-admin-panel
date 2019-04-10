let mongoose = require("mongoose");

let applicationSchema = mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  username:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  status:{
    type:Boolean,
    required:true
  },
  document:{
    type:String,
    required:true
  }
})

module.exports = mongoose.model('Application',applicationSchema)
