const express = require("express");
const router = express.Router();
const app = express();
const htmlController=require("../controllers/htmlController")
const middle = require("../controllers/middle")
const multer = require("multer")
const path = require("path")
const postController = require("../controllers/postController")
const otpController = require("../controllers/otpController")
const medicalReportController = require("../controllers/medicalReportController")
const scheduleController = require("../controllers/scheduleController")
const doctorController = require("../controllers/doctorController");
const { hrtime } = require("process");
  


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../../client/assets/uploads'));
    }, 
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
  }
  const upload = multer({ storage: storage, fileFilter: fileFilter });


router.route("/").get(middle.loggedin,htmlController.emailLogin)
router.route("/homePage").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.home);
router.route("/doctor").get(middle.notloggedin,middle.doctorProfileComplete,doctorController.getDoctors,htmlController.doctor)
router.route("/doctor/:pageNumber").get(middle.notloggedin,middle.doctorProfileComplete,doctorController.getDoctors,htmlController.doctor)
router.route("/hospital").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.hospital)
router.route("/contactUs").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.contactUs)
router.route("/dentistry").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.dentistry)
router.route("/aboutUs").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.aboutUs)
router.route("/doctorProfile/:doctorId").get(middle.notloggedin,middle.doctorProfileComplete,doctorController.getDoctors,htmlController.doctorProfile)
router.route("/aboutHospital").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.aboutHospital)
router.route("/FAQ").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.FAQ)
router.route("/phoneLogin").get(middle.loggedin,htmlController.phoneLogin)
router.route("/bookAppointment").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.bookAppointment)
router.route("/tvastraPlus").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.tvastraPlus)
router.route("/signup").get(middle.loggedin,htmlController.signup)
router.route("/otpForgotPassword").get(middle.loggedin,htmlController.otpForgotPassword)
router.route("/createPassword").get(middle.notloggedin,htmlController.createPassword)
router.route("/logout").get(middle.notloggedin,middle.logout)
router.route("/otpLogin").get(htmlController.otpLogin)
router.route("/query").get(middle.notloggedin,middle.doctorProfileComplete,htmlController.query)
router.route("/addDoctorDetails").get(htmlController.addDoctorDetails)
router.route("/profile").get(htmlController.profile)
router.route("/appointment").get(htmlController.appointment)
router.route("/settings").get(htmlController.settings)
router.route("/medicalReports").get(htmlController.medicalReports)
router.route("/createSchedule").get(htmlController.createSchedule)
router.route("/showReport/:reportId").get(htmlController.showReport)
router.route("/bookDoctorAppointment").get(htmlController.bookDoctorAppointment)
router.route("/bookDoctorAppointment/:doctorId/:subScheduleId/:appointmentDate").get(scheduleController.bookDoctorAppointment)
router.route("/bookDoctorAppointment/:appointmentId/:doctorId/:subScheduleId/:appointmentDate").get(scheduleController.bookDoctorAppointment)
router.route("/appointmentConfirmation").get(htmlController.appointmentConfirmation)
router.route("/rescheduleAppointment").get(htmlController.rescheduleAppointment)
router.route("/rescheduleAppointment/:appointmentId").get(scheduleController.reschedule,htmlController.rescheduleAppointment)



 
/*<---------------------------------------------------POST METHOD--------------------------------------> */


router.route("/signup").post(middle.loggedin,postController.signup)
router.route("/login").post(middle.loggedin,htmlController.home)
router.route("/forgotPassword").post(middle.loggedin,otpController.forgotPassword)
router.route("/").post(middle.loggedin,postController.emailLogin,middle.doctorProfileComplete,htmlController.home)
router.route("/otp_verify_for_changePassword").post(otpController.otp_verify_for_changePassword)
router.route("/createPassword").post(postController.changePassword)
router.route("/phoneLogin").post(otpController.phoneLogin)
router.route("/otp_validation").post(otpController.otp_validation,htmlController.home)
router.route("/otp_validation_ditMobileNumber").post(otpController.editMobileNumber,htmlController.profile)
router.route("/resendOTP").post(otpController.otp_resend)
router.route("/addDoctorDetails").post(upload.single('doctorImage'),postController.addDoctorDetails)
router.route("/add_medical_report").post(middle.notloggedin,upload.array('reportImage',10),medicalReportController.add)
router.route("/deleteReport/:reportId").post(middle.notloggedin,medicalReportController.delete)
router.route("/createSchedule").post(middle.notloggedin,scheduleController.isValid,scheduleController.create)
router.route("/deleteSchedule/:scheduleId").post(scheduleController.deleteSchedule)
router.route("/disable/:subScheduleId").post(scheduleController.disabled)
router.route("/settings").post(postController.settings)
router.route("/editProfile").post(middle.notloggedin,upload.single('select_photo'),postController.editProfile)
router.route("/deleteReportPic/:reportId/:picNumber").post(medicalReportController.deleteReportPic)
router.route("/updateMedicalReport/:reportId").post(upload.array('reportImage',10),medicalReportController.updateMedicalReport)
router.route("/disableSchedule/:scheduleId").post(scheduleController.isDisabled)
router.route("/editMobileNumber").post(postController.editMobileNumber)
router.route("/appointmentConfirmation").post(doctorController.bookDoctorAppointment,htmlController.appointmentConfirmation)
router.route("/cancelAppointment/:appointmentId/:slot").post(postController.cancelAppointment)
router.route("/doctorFilter").post(doctorController.filter)
router.route("/sortDoctor").post(doctorController.sort)





router.route("/showDoctorScehdule/:docId").put(scheduleController.showDoctorScehdule)
router.route("/showSubSchedule/:docId/:n").put(scheduleController.showSubSchedule)
router.route("/getNextAvailableSlot/:docId/:n").put(scheduleController.getNextAvailableSlot)
router.route("/clearToaster").put(middle.clearToaster)


 

module.exports = router;
