const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const Address = new Schema({
    id:{type:Number},
    name:{type:String},
    email:{type:String},
  });
  module.exports = mongoose.model("address", Address);