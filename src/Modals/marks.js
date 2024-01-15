const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const marksSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    marks: [{
      subject: { type: String },
      score: { type: Number },
    }],
  });
module.exports = mongoose.model("marks", marksSchema);
