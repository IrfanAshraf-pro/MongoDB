const mongoose=require('mongoose');
const Schema = mongoose.Schema;
mongoose.model('auth');
const userProfile=new Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId,
        required: true, 
        //id from Auth;
        ref: "auth",
    },
    name:{type:String},
    profilePic:{type:String},
    address:{type:String}
  });
  userProfile.virtual('auth', {
    ref: 'auth',
    localField: 'userId',
    foreignField: '_id'
  });
  module.exports = mongoose.model("userProfile", userProfile);