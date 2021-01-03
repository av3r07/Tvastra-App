module.exports = {
    home: home,
    doctor:doctor,
    hospital:hospital,
    contactUs:contactUs,
    dentistry:dentistry,
    aboutUs:aboutUs,
    doctorProfile:doctorProfile,
    aboutHospital:aboutHospital,
    FAQ:FAQ,
    emailLogin:emailLogin,
    bookAppointment:bookAppointment,
    tvastraPlus:tvastraPlus,
    phoneLogin:phoneLogin,
    signup:signup,
    otpForgotPassword:otpForgotPassword,
    createPassword:createPassword,
    otpLogin:otpLogin,
    query: query,
    addDoctorDetails:addDoctorDetails,
    profile:profile,
    appointment:appointment,
    settings:settings,
    medicalReports:medicalReports,
    createSchedule:createSchedule,
    showReport:showReport,
    bookDoctorAppointment:bookDoctorAppointment,
    appointmentConfirmation:appointmentConfirmation,
    rescheduleAppointment:rescheduleAppointment
};


async function rescheduleAppointment(req,res){
  res.render("rescheduleAppointment",{
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}

async function appointmentConfirmation(req,res){
  res.render("appointmentConfirmation",{
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}

async function bookDoctorAppointment(req,res){
  res.render("bookDoctorAppointment",{
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}


function showReport(req,res){
  res.render("showReport",{
    reportId: req.params.reportId,
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}


async function createSchedule(req,res){
  res.render("createSchedule",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}


async function medicalReports(req,res){
  res.render("medicalReports",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}


async function settings(req,res){
  res.render("settings",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}


async function query(req,res){
  res.render("query",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}
  
async function createPassword(req,res){
  res.render("createPassword",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}


async function otpForgotPassword(req,res){
  res.render("otpForgotPassword",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function home(req, res) {
    res.render("homePage",{
      user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
    });
}

async function doctor(req,res){
  var pageNumber = req.params.pageNumber || 1;
  if(pageNumber == 1)
  req.session.user.currentDoctorsPage = 1;
  else
  req.session.user.currentDoctorsPage = parseInt(req.params.pageNumber);
  req.session.user.doctorsPage = [];
  for (var i = (pageNumber - 1) *2 ; i < pageNumber * 2; i++)
    if (req.session.user.doctorList[i])
      req.session.user.doctorsPage.push(req.session.user.doctorList[i]);

  res.render("doctor",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}
  
async function hospital(req,res){
  res.render("hospital",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function contactUs(req,res){
  res.render("contactUs",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}
async function dentistry(req,res){
  res.render("dentistry",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function aboutUs(req,res){
  res.render("aboutUs",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function doctorProfile(req,res){
  var id = req.params.doctorId;
  for(var i=0;i<req.session.user.doctorList.length;i++){
    if(req.session.user.doctorList[i]._id == id)
    req.session.user.doctorProfile = req.session.user.doctorList[i];
  }
  res.render("doctorProfile",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function aboutHospital(req,res){
  res.render("aboutHospital",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function FAQ(req,res){
  res.render("FAQ",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function emailLogin(req,res){
  res.render("emailLogin",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}
async function otpLogin(req,res){
  res.render("otpLogin",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function bookAppointment(req,res){
  res.render("bookAppointment",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function appointment(req,res){
  res.render("appointment",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function tvastraPlus(req,res){
  res.render("tvastraPlus",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function phoneLogin(req,res){
  res.render("phoneLogin",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function signup(req,res){
  res.render("signup",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function addDoctorDetails(req,res){
  res.render("addDoctorDetails",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}

async function profile(req,res){
  res.render("profile",{
    user: req.session.user,
  message: req.session.message,
  messageType: req.session.messageType});
}