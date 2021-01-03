const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    date:{
        type:String,
    },
    time:{
        type:String
    },
  doctor: {
      type: mongoose.ObjectId,
      required:true
  },
  doctorName:{
      type: String,
      required:true
  },
  slot:{
    type: mongoose.ObjectId,
    required:true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
},
patientNumber: {
    type: String,
    required: true,
    trim: true
},

  patientEmail: {
    type: String,
    required: true,
    trim: true
  },
  hospital:{
    type: String,
    required: true,
    trim: true
  },
  status:{
    type:String,
    default: "Confirmed"
  }
},
  { timestamps: true });
const appointment = mongoose.model("appointmentSchema", appointmentSchema);
module.exports = {
    appointmentData:appointment,
    appointmentSchema:appointmentSchema
}
 