var mongoose = require("mongoose");
var db = require("./database");
const medicalReport = require("./medicalReportsDatabase");
const schedule = require("./scheduleDatabase");
const appointment = require("./appointmentDatabase");
var Schema = mongoose.Schema;


const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Every user must have a name.']
	},
	gender: {
		type: String,
		enum: ['Male', 'Female', 'Others'],
		required: [true, 'Every user must have a gender.']
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Every user must have a email address']
	},
	password: {
		type: String,
		required: [true, 'Every user must have a password.']
	},
	mobile: {
		type: String,
		required:[true,"Please Enter 10 digit mobile number"],
		unique:true
	},
	dob: {
		type: Date,
		required: [true, 'Every user must have a DOB']
	},
	city: {
    type: String,
    lowercase: true,
	},
	state: {
    type: String,
    lowercase: true, 
	},
	country: {
		type: String,
  },
  isDoctor:{
	  type: String,
	  default: "user"
  },
house:{
	type:String
},
locality:{
	type:String
},
  doctorData:{
	description: {
		type: String,
		trim: true
	  },
	  specializations: {
		type: Array,
		lowercase: true,
	  },
	  qualifications: {
		type: Array,
		lowercase: true,
	  },
	  hospitals: {
		type: Array,
		lowercase: true,
	  },
	 
	  achievements: {
		type: Array,
		lowercase: true,
	  },
	  awards: {
		type: Array,
		lowercase: true,
	  },
	  experience: {
		type: Number
	  },
	  fees: {
		type: Number
	  },
	  treatments:{
		  type:Array,
		  lowercase:true
	  }
  },
 image:{
	type: String,
  },
  medicalReportData: [medicalReport.medicalReportSchema],
  scheduleData: [schedule.scheduleSchema],
  appointmentData: [appointment.appointmentSchema]
},{timestamps:true});




const userData = mongoose.model("User",userSchema);
module.exports = userData;
