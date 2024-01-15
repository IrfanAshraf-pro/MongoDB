const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const userschema = new Schema({
  name:{type:String},
  email:{type:String},
  password:{type:String},
  verificationtoken:{type:String},
  emailVerification:{type:Boolean,default:false},
resetToken: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("auth", userschema);

