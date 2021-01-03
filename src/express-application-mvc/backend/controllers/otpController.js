var mongoose = require("mongoose");
var Nexmo = require("nexmo");
const userData = require("../databases/userDatabase");


const nexmo = new Nexmo({
    apiKey: '1e617701', 
    apiSecret: "P81Q0JOzeaFnfcPF"
  });

  function forgotPassword(req, res) {
    const email = req.body.email.toLowerCase();
    if(email == "")
    res.redirect("/")
    console.log(email);
      userData.findOne({ "email": email })
      .then(user => {
        if (user) {
          const mobile = user.mobile;
          console.warn("number", mobile);
          nexmo.verify.request({
            number: "91" + mobile,
            brand: 'Tvastra forgot',
            code_length: '4',
            pin_expiry: "120"
          }, (err, result) => {
            if (err) {
              console.log("error", err);
              req.session.loggedUser = false;
              req.session.message = "Invalid Request";
              req.session.messageType = "Failure";
              res.redirect("/");
            } 
            else {
              if (result) {
                req.session.user = user;
                req.session.mobile = user.mobile;
                req.session.nexmoRequestId = result.request_id;
                req.session.otpType = "change password";
                req.session.message = "OTP Sent Successfully to change password";
                req.session.messageType = "Success";
                res.redirect("/otpForgotPassword");
              }
            }
          });
        }
        else {
          console.warn("email not registerd");
          req.session.loggedUser = false;
          req.session.message = "Email Not Registered";
          req.session.messageType = "Failure";
          res.redirect("/");
        }
      })
  }
  

  function otp_resend(req, res) { 
    nexmo.verify.control({
      request_id: req.session.nexmoRequestId,
      cmd: 'cancel'
    }, (err, result) => {
      if (err) {
        console.log("error sending otp", err);
        req.session.message = "Error Sending OTP Try again";
        req.session.messageType = "Failure";
        res.redirect("/otpForgotPassword");
      } else {
        nexmo.verify.request(
          {
            number: "91" + req.session.mobile,
            brand: "Tvastra Resend",
            code_length: "4", 
            pin_expiry: "120"
          }, (err1, result1) => {
            if (err1) {
              console.log("error sending otp", err1);
              req.session.message = "Error Sending OTP Try again";
              req.session.messageType = "Failure";
              return res.redirect("/otpForgotPassword");
            } else {
              if (result1) {
                console.log("otp sent");
                req.session.nexmoRequestId = result1.request_id;
                req.session.message = "OTP Sent Successfully";
                req.session.messageType = "Success";
                return res.redirect("/otpForgotPassword");
              } else {
                console.log("some error occured try again");
                req.session.message = "Error Sending OTP Try again";
                req.session.messageType = "Failure";
                return res.redirect("/otpForgotPassword");
              }
            }
          });
      }
    });
  }

  function otp_verify_for_changePassword(req, res) {
    var code = req.body.digit1+req.body.digit2+req.body.digit3+req.body.digit4;
    nexmo.verify.check({
      request_id: req.session.nexmoRequestId,
      code: code
    }, (err, result) => {
      if (result) {
        req.session.loggedUser = false;
        console.log("otp verified")
        req.session.message = "Otp Verified";
        req.session.messageType = "Success";
        res.redirect("/createPassword");
      }
      else {
        req.session.message = "Invalid Otp";
        req.session.messageType = "Failure"; 555
        res.redirect("/otpForgotPassword")
      }
    }); 
  }
  
  
  function otp_validation(req, res,next) {
    var code = req.body.digit1+req.body.digit2+req.body.digit3+req.body.digit4;
    nexmo.verify.check({
      request_id: req.session.nexmoRequestId,
      code: code
    }, (err, result) => {
      if (result) {
        userData.findOne({mobile:req.session.mobile})
        .then(user=>{
          console.log("otp verified");
          req.session.user = user;
          req.session.loggedUser = true;
        req.session.message = "Logged in successfully";
        req.session.messageType = "Success";
       next();
        })
      }
      if(err) {
        req.session.message = "Invalid Otp";
        req.session.messageType = "Failure";
        res.redirect("/otpLogin")
      }
    });
  }
  
const phoneLogin = async(req,res)=>{
    userData.findOne({ "mobile": req.body.mobile})
    .then(user => {
      if (user) {
        const mobile = user.mobile;
        console.warn("number", mobile);
        nexmo.verify.request({
          number: "91" + mobile,
          brand: 'Tvastra forgot',
          code_length: '4',
          pin_expiry: "120"
        }, (err, result) => {
          if (err) {
            console.log("error", err);
            req.session.loggedUser = false;
            req.session.message = "Invalid Request";
            req.session.messageType = "Failure";
            res.redirect("/phoneLogin");
          }
          else {
            if (result) {
              req.session.mobile = user.mobile;
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
        req.session.loggedUser = false;
        req.session.message = "Mobile number Not Registered";
        req.session.messageType = "Failure";
        res.redirect("/phoneLogin");
      }
    })
}
  
function editMobileNumber(req, res,next) {
  var code = req.body.digit1+req.body.digit2+req.body.digit3+req.body.digit4;
  nexmo.verify.check({
    request_id: req.session.nexmoRequestId,
    code: code
  }, (err, result) => {
    if (result) {
      userData.findOne({mobile:req.session.mobile})
      .then(user=>{
        console.log("otp verified");
        req.session.user = user;
        user.mobile = req.session.newMobile;
        req.session.loggedUser = true;
      req.session.message = "Logged in successfully";
      req.session.messageType = "Success";
     next();
      })
    }
    if(err){
      req.session.message = "Invalid Otp";
      req.session.messageType = "Failure";
      res.redirect("/otpLogin")
    }
  });
}
  module.exports ={
    forgotPassword:forgotPassword,
    otp_resend: otp_resend,
    otp_validation: otp_validation,
    otp_verify_for_changePassword:otp_verify_for_changePassword,
    phoneLogin:phoneLogin,
    editMobileNumber:editMobileNumber
  }