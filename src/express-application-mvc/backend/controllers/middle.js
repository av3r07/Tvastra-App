const user = require("../databases/userDatabase");

const notloggedin = (req, res, next) => {
  if (!req.session.loggedUser) {
    req.session.message = "Please Login First";
    req.session.messageType = "Failure";
    res.redirect("/");
  } else { 
    next();
  }
};
const loggedin = (req, res, next) => {
  if (req.session.loggedUser) {
    res.redirect("/homePage");
  } else {
    next(); 
  }
};

const login = (req, res, next) => {
  if (!req.session.loggedUser || req.session.loggedUser) {
    next();
  } else {
    res.redirect("/");
  }
};


const clearToaster = async (req, res) => {
  req.session.messageType = null;
  req.session.message = null;
  res.status(200).send("Successfully changed");
}

const logout = (req,res)=>{
  req.session.user = null;
  req.session.loggedUser = false;
  req.session.messageType = "Success";
  req.session.message = "User successfully logged out";
  res.redirect("/");
}

const doctorProfileComplete = (req,res,next)=>{
  if(req.session.user.isDoctor === "doctor"){
    var data = req.session.user.doctorData;
    if(data.specializations == null || data.qualifications == null || data.achievements == null || data.fees == null || data.description == null || data.experience == null)
    res.redirect("addDoctorDetails");
    else
    next();
  }
  else
  next();
}

module.exports={
    notloggedin:notloggedin,
    loggedin:loggedin,
    login:login,
    clearToaster:clearToaster,
    logout:logout,
    doctorProfileComplete:doctorProfileComplete
};