const mongoose = require("mongoose");
const subSchedule = require("./subScheduleDatabase");
const scheduleSchema = new mongoose.Schema({
  day: {
      type:String,
      required:true
  },
  hospital:{
    type:String,
    required:true
  },
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

  interval: {
    type: Number,
    default:15
  },
  isDisabled:{
    type:Boolean,
    default:false
  },
subScheduleData:[subSchedule.subScheduleSchema]
},
  { timestamps: true });
const schedule = mongoose.model("scheduleSchema", scheduleSchema);
module.exports = {
    scheduleData:schedule,
    scheduleSchema:scheduleSchema
}
 