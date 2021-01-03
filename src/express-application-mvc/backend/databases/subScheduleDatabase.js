const mongoose = require("mongoose");
const subScheduleSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
},
endTime: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
},

  booked:{
      type:Boolean,
      default:false
  },
  disabled:{
    type:Boolean,
    default:false
  }
},
  { timestamps: true });
const subSchedule = mongoose.model("subScheduleSchema", subScheduleSchema);
module.exports = {
    subScheduleData:subSchedule,
    subScheduleSchema:subScheduleSchema
}
 