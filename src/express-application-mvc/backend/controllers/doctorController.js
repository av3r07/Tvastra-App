const userData = require("../databases/userDatabase");
async function getDoctors(req,res,next){
    const doctors = await userData.find({isDoctor:"doctor"});
    const doctorFilterHospital = [];
    const doctorFilterCity = [];
    for(var i=0; i<doctors.length;i++){
        var flag = false;
        for(var j=0;j<doctors[i].doctorData.hospitals.length;j++){
            flag = false;
            for(var k =0;k<doctorFilterHospital.length;k++){
                if(doctors[i].doctorData.hospitals[j] == doctorFilterHospital[k])
                flag = true;
            }
            if(flag == false)
            doctorFilterHospital.push(doctors[i].doctorData.hospitals[j]);
        }
        flag = false;
        for(var k =0;k<doctorFilterCity.length;k++){
            if(doctors[i].city == doctorFilterCity[k])
            flag = true;
        }
        if(flag == false)
        doctorFilterCity.push(doctors[i].city);
    }
    req.session.user.doctorFilterHospitalList = doctorFilterHospital;
    req.session.user.doctorFilterCityList = doctorFilterCity;
    if(req.session.user.filtered != true  && req.session.user.sorted != true){
        req.session.user.doctorList = doctors;
        req.session.user.filter = [];
    }    
    next();
}


async function bookDoctorAppointment(req,res,next){
    var appointmentDate = req.session.user.appointmentDate;
    var appointmentTime = req.session.user.appointmentTime;
    var appointmentHospital = req.session.user.appointmentHospital;
    var appointmentSubSchedule = req.session.user.appointmentSubSchedule;
    if(req.session.user.rescheduleStatus == false){
        await userData.findById(req.session.user._id)
    .then(async function(user){
        await userData.findById(req.session.user.appointmentDoctor._id)
        .then(async function(doctor){
            for(var i =0;i<doctor.scheduleData.length;i++){
                for(var j=0;j<doctor.scheduleData[i].subScheduleData.length;j++){
                    if(doctor.scheduleData[i].subScheduleData[j]._id == req.session.user.appointmentSubSchedule){
                        doctor.scheduleData[i].subScheduleData[j].booked = true;
                        await doctor.save();
                    }
                }
            }
        });
        user.appointmentData.push({
            date : req.session.user.appointmentDate,
            time : req.session.user.appointmentTime,
            doctor : req.session.user.appointmentDoctor._id,
            doctorName : req.session.user.appointmentDoctor.name,
            slot : req.session.user.appointmentSubSchedule,
            patientName : req.body.patientName,
            patientNumber : req.body.patientMobile,
            patientEmail : req.body.patientEmail,
            hospital : req.session.user.appointmentHospital
        });
        req.session.user = await user.save();
        req.session.user.appointmentId = req.session.user.appointmentData[req.session.user.appointmentData.length-1]._id;
    const appointmentDoctor = await userData.findById(req.session.user.appointmentData[req.session.user.appointmentData.length-1].doctor);
    req.session.user.appointmentDoctor =  appointmentDoctor;
    req.session.user.appointmentHospital = appointmentHospital;
    req.session.user.appointmentTime = appointmentTime;
    req.session.user.appointmentDate = appointmentDate;
    req.session.user.appointmentSubSchedule = appointmentSubSchedule;
    req.session.filtered = false;
    req.session.sorted = false;
    req.session.messageType = "Success";
    req.session.message = "Appointment booked";
    next();
    })
    }
    else{
        await userData.findById(req.session.user._id)
    .then(async function(user){
        for(var k=0;k<user.appointmentData.length;k++){
            if(user.appointmentData[k]._id == req.session.user.rescheduleId){
        await userData.findById(req.session.user.appointmentDoctor._id)
        .then(async function(doctor){
            for(var i =0;i<doctor.scheduleData.length;i++){
                for(var j=0;j<doctor.scheduleData[i].subScheduleData.length;j++){
                    if(doctor.scheduleData[i].subScheduleData[j]._id == req.session.user.appointmentSubSchedule){
                        doctor.scheduleData[i].subScheduleData[j].booked = true;
                        await doctor.save();
                    }
                    if(doctor.scheduleData[i].subScheduleData[j]._id == user.appointmentData[k].slot){
                        doctor.scheduleData[i].subScheduleData[j].booked = false;
                        await doctor.save();
                    }
                }
            }
        });
            user.appointmentData[k].date = req.session.user.appointmentDate;
            user.appointmentData[k].time = req.session.user.appointmentTime;
            user.appointmentData[k].slot = req.session.user.appointmentSubSchedule;
            user.appointmentData[k].patientName = req.body.patientName;
            user.appointmentData[k].patientNumber = req.body.patientMobile;
            user.appointmentData[k].patientEmail = req.body.patientEmail;
            user.appointmentData[k].hospital = req.session.user.appointmentHospital;
        req.session.user = await user.save();
        req.session.user.appointmentId = user.appointmentData[k]._id;
    const appointmentDoctor = await userData.findById(user.appointmentData[k].doctor);
    req.session.user.appointmentDoctor =  appointmentDoctor;
    req.session.user.appointmentHospital = appointmentHospital;
    req.session.user.appointmentTime = appointmentTime;
    req.session.user.appointmentDate = appointmentDate;
    req.session.user.appointmentSubSchedule = appointmentSubSchedule;
    req.session.filtered = false;
    req.session.sorted = false;
    req.session.messageType = "Success";
    req.session.message = "Appointment booked";
    next();
            }
        }
    })
    }
}

async function filter(req,res){
    req.session.user.sorted = false;
    req.session.user.filter = [];
    var hospitals =req.body.hospitals;
    console.log(hospitals);
    if(hospitals){
        hospitals.forEach(e => {
            req.session.user.filter.push(e);
        });
        req.session.user.filtered = true;
    var query = {
        isDoctor: "doctor",
        "doctorData.hospitals":{$all:hospitals}
    };
    const doctor = await userData.find(query);
    req.session.user.doctorList = doctor;
    res.redirect("/doctor");
}
else{
    req.session.user.filter = [];
    req.session.user.filtered = false;
    res.redirect("/doctor");
}
}


async function sort(req,res){
    var doctorList = [];
    var sortBy = req.body.sort;
    var doctors;
    sortBy = sortBy.split("-");
    for(var i=0; i<req.session.user.doctorList.length;i++){
        doctorList.push(req.session.user.doctorList[i]._id);
    }
    if(sortBy[0] == "name"){
        if(sortBy[1] == "asc")
        doctors = await userData.find({_id:{$in:doctorList}}).sort({name: 1});
        else
        doctors = await userData.find({_id:{$in:doctorList}}).sort({name: -1});
    }
    else if(sortBy[0] == "fees"){
        if(sortBy[1] == "asc")
        doctors = await userData.find({_id:{$in:doctorList}}).sort({"doctorData.fees": 1});
        else
        doctors = await userData.find({_id:{$in:doctorList}}).sort({"doctorData.fees": -1});
    }
    else{
        if(sortBy[1] == "asc")
        doctors = await userData.find({_id:{$in:doctorList}}).sort({"doctorData.experience": 1});
        else
        doctors = await userData.find({_id:{$in:doctorList}}).sort({"doctorData.experience": -1});
    } 
    req.session.user.sorted = true;
    req.session.user.doctorList = doctors;
    res.redirect("/doctor");
}


module.exports = {
    getDoctors : getDoctors,
    bookDoctorAppointment : bookDoctorAppointment,
    filter : filter,
    sort : sort
};