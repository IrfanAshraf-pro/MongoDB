const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    name: { type: String },
    rollNumber: { type: String },
    profilePic: { type: String },
    address: { type: String },
});
 
  module.exports = mongoose.model("studentprofile", studentSchema);