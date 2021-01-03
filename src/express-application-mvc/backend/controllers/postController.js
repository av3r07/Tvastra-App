var mongoose = require("mongoose");
var db = require("../databases/database");
var path = require("path");
const multer = require("multer");
var bcrypt = require("bcrypt");
const userData = require("../databases/userDatabase");
const { json } = require("body-parser");
var Nexmo = require("nexmo");

const nexmo = new Nexmo({
  apiKey: '1e617701', 
  apiSecret: "P81Q0JOzeaFnfcPF"
});


const addDoctorDetails = (req,res)=>{
 var description = req.body.description;
 var specializations = (JSON.parse(req.body.specializations)).map(({ value }) => value);
 var qualifications = (JSON.parse(req.body.qualifications)).map(({ value }) => value);
 var hospitals = (JSON.parse(req.body.hospitals)).map(({ value }) => value);
 var treatments = (JSON.parse(req.body.treatments)).map(({ value }) => value);
 var achievements =[],awards=[];
 if(req.body.achievements.length > 0)
 achievements = (JSON.parse(req.body.achievements)).map(({ value }) => value);
 if(req.body.awards.length > 0)
 awards = (JSON.parse(req.body.awards)).map(({ value }) => value);
 var experience = req.body.experience;
 var fees = req.body.fees;
    let Image;
  userData.findById(req.session.user._id)
    .then(result => {
      if (req.file !== undefined) {
        Image = req.file.filename;
        result.doctorData.description = description,
          result.doctorData.specializations = specializations,
          result.doctorData.qualifications = qualifications,
          result.doctorData.hospitals = hospitals,
          result.doctorData.achievements = achievements,
          result.doctorData.awards = awards,
          result.doctorData.experience = experience,
          result.doctorData.fees = fees,
          result.doctorData.treatments = treatments,
          result.image = Image
      } else {
        result.doctorData.description = description,
          result.doctorData.specializations = specializations,
          result.doctorData.qualifications = qualifications,
          result.doctorData.hospitals = hospitals,
          result.doctorData.achievements = achievements,
          result.doctorData.awards = awards,
          result.doctorData.experience = experience,
          result.doctorData.fees = fees,
          result.doctorData.treatments = treatments
      }
      result.save()
        .then(user => {
          console.warn("data saved");
          req.session.user = user;
          req.session.message = "Data Saved";
          req.session.messageType = "Success";
          res.redirect("/homePage");
        })
        .catch((err) => {
          console.warn("Some error", err);
          req.session.message = "Error Occured Try Again";
          req.session.messageType = "Failure";
          req.session.loggedUser = true;
        })
    })
    .catch((err) => {
      console.warn("Some error", err);
      req.session.message = "Error Occured Try Again";
      req.session.messageType = "Failure";
      req.session.loggedUser = true;
    })

}

const signup = async(req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password,10);
    const users = await userData.create({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        mobile: req.body.mobile,
        gender: req.body.gender, 
        dob: req.body.dob,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        isDoctor: req.body.isdoctor?"doctor":"user"
    });
    users
    .save() 
    .then(user=>{
        console.warn("new user created Successfully");
        req.session.loggedUser = true;
        req.session.user = user;
        req.session.message = "Sign Up Success";
        req.session.messageType = "Success";
        return req.session.user.isDoctor == "doctor" ? res.redirect("/addDoctorDetails") : res.redirect("/homePage");
    })
    .catch(err=>{
        console.log("Some error occured", err);
      req.session.loggedUser = false;
      req.session.message = "Sign Up Failed";
      req.session.messageType = "Failure";
      if (err.code === 11000) {
        req.session.message = `${err.keyValue[((Object.keys(err.keyPattern)))]} is already registered.`;
      }
      return res.redirect("/signup");
    });
}

const emailLogin = async (req, res,next) => {
  const { email, password } = req.body;

  userData.findOne({ email: email.toLowerCase() })
    .then(async (user) => {
      if (user) {
        await bcrypt.compare(
          password, user.password,
          async (err, result) => {
            if (err) {
              console.warn("Invalid Password", err);
              req.session.loggedUser = false;
              req.session.message = "Login Failed";
              req.session.messageType = "Failure";
              return res.redirect("/");
            } else if (result === true) {
              console.log("Login Success");
              req.session.loggedUser = true;
              req.session.user = user;
              req.session.message = "Login Successfull";
              req.session.messageType = "Success";
              next();
            } else {
              console.log("Wrong Password");
              req.session.loggedUser = false;
              req.session.message = "Invalid Password";
              req.session.messageType = "Failure";
              res.redirect("/");
            }

          }
        );
      } else {
        console.log("User not exist");
        req.session.message = "User Doesn't Exists";
        req.session.messageType = "Failure"
        req.session.loggedUser = false;
        return res.redirect("/");
      }
    })
    .catch((err) => {
      console.log("User does not exist");
      req.session.loggedUser = false;
      req.session.message = "Wrong username";
      req.session.messageType = "Failure";
      return res.redirect("/");
    });
}


const changePassword = async(req,res)=>{

  if(req.body.password === req.body.confirm){
		const user = await userData.findOne({"mobile": req.session.mobile});
    user.password = bcrypt.hashSync(req.body.password,10);
    user.save();
		req.session.loggedUser = false;
		req.session.message = 'Password Changed Successfully';
    req.session.messageType = 'Success';
		res.redirect('/'); 
	} else {
		req.session.message = 'Passwords do not match';
		req.session.messageType = 'Failure';
		res.redirect('/createPassword');
	}
}

async function settings(req,res){
  userData.findById(req.session.user._id)
  .then(async function(user){
    console.log(req.body.current_password);
    console.log(user.password);
    await bcrypt.compare(req.body.current_password,user.password,async function(err,result){
      if(err){
        req.session.message = "Invalid current password";
        req.session.messageType = "Failure";
        req.session.user = user;
        res.redirect("/settings");
      }
      else if(result==true){
        if(req.body.new_password == req.body.confirm_password)
      {
        user.password = bcrypt.hashSync(req.body.new_password,10);
        await user.save();
        req.session.loggedUser = false;
        req.session.message = "Password changed successfully";
        req.session.messageType = "Success";
        res.redirect("/");
      }
      else{
        req.session.message = "New passwords dosen't match";
        req.session.messageType = "Failure";
        req.session.user = user;
        res.redirect("/settings");
      }
      }
      else{
        req.session.message = "Current Password does not match";
        req.session.messageType = "Failure";
        req.session.user = user;
        res.redirect("/settings");
      }
    })
  })
  .catch(err=>{
        req.session.message = "Some error occured";
        req.session.messageType = "Failure";
        req.session.user = user;
        res.redirect("/settings");
  })
}

async function editProfile(req,res){
 userData.findById(req.session.user._id)
 .then(async(user)=>{
  if(user.isDoctor == "doctor"){
    var specializations = (JSON.parse(req.body.specializations)).map(({ value }) => value);
  var qualifications = (JSON.parse(req.body.qualifications)).map(({ value }) => value);
  var hospitals = (JSON.parse(req.body.hospitals)).map(({ value }) => value);
  var achievements = (JSON.parse(req.body.achievements)).map(({ value }) => value);
  var awards = (JSON.parse(req.body.awards)).map(({ value }) => value);
  var treatments = (JSON.parse(req.body.treatments)).map(({ value }) => value);
    user.doctorData.specializations = specializations;
    user.doctorData.qualifications = qualifications;
    user.doctorData.awards = awards;
    user.doctorData.hospitals = hospitals;
    user.doctorData.achievements = achievements;
    user.doctorData.treatments = treatments;
    user.doctorData.experience = req.body.experience;
    user.doctorData.fees = req.body.fees;
    user.doctorData.description = req.body.description;
  }
  user.name = req.body.name;
  user.mobile = req.body.mobile;
  user.email = req.body.email;
  user.gender = req.body.gender;
  user.dob = req.body.dob;
  user.house = req.body.house,
  user.locality = req.body.locality;
  user.city = req.body.city;
  user.state = req.body.state;
  user.country = req.body.country;
  user.image = req.file === undefined ? req.session.user.image : req.file.filename;
  req.session.user = await user.save();
  req.session.message = "Profile updated successfully";
  req.session.messageType = "Success";
  res.redirect("/profile");
 })
 .catch(err=>{
  req.session.message = "Profile not updated. Some error occured.";
  req.session.messageType = "Failure";
  res.redirect("/profile");
 })
}

async function editMobileNumber(req,res){
  userData.findOne({ "mobile": req.body.mobile})
    .then(user => {
      if (user) {
        const mobile = req.body.newMobile;
        console.warn("number", mobile);
        nexmo.verify.request({
          number: "91" + mobile,
          brand: 'Tvastra forgot',
          code_length: '4',
          pin_expiry: "120"
        }, (err, result) => {
          if (err) {
            console.log("error", err);
            req.session.loggedUser = true;
            req.session.message = "Invalid Request";
            req.session.messageType = "Failure";
            res.redirect("/profile");
          }
          else {
            if (result) {
              req.session.mobile = user.mobile;
              req.session.newMobile = req.body.newMobile;
              req.session.nexmoRequestId = result.request_id;
              req.session.otpType = "login";
              req.session.message = "OTP Sent Successfully";
              req.session.messageType = "Success";
              res.redirect("/otpLogin");
            }
          }
        });
      }
      else {
        console.warn("Mobile number not registerd");
        req.session.loggedUser = true;
        req.session.message = "Some error occured";
        req.session.messageType = "Failure";
        res.redirect("/profile");
      }
    })
}

async function cancelAppointment(req,res){
  await userData.findById(req.session.user._id)
  .then(async function(user){
    for(var i=0;i<user.appointmentData.length;i++){
      if(user.appointmentData[i]._id == req.params.appointmentId){
        await userData.findById(user.appointmentData[i].doctor)
        .then(async function(doctor){
          for(var j =0;j<doctor.scheduleData.length;j++){
            for(var k=0;k<doctor.scheduleData[j].subScheduleData.length;k++){
                if(doctor.scheduleData[j].subScheduleData[k]._id == req.params.slot){
                  doctor.scheduleData[j].subScheduleData[k].booked = false;
                  await doctor.save();
                  break;
                }
            }
        }
        });
      }
    }
    user.save();
  })
  let appointment= await userData.findOneAndUpdate({_id:req.session.user._id},
    {
        $pull:{"appointmentData":{_id: req.params.appointmentId} }
    })
    req.session.message = "Appointment successfully deleted.";
    req.session.messageType = "Success";
    req.session.user = await userData.findOne({_id: req.session.user._id});
    req.session.user.filtered = false;
    req.session.user.sorted = false;
res.redirect("/doctor");
}

module.exports={
  signup:signup,
  emailLogin:emailLogin,
  changePassword: changePassword,
  addDoctorDetails:addDoctorDetails,
  settings:settings,
  editProfile:editProfile,
  editMobileNumber:editMobileNumber,
  cancelAppointment:cancelAppointment
}