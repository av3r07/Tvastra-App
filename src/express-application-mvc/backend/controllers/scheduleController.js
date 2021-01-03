const mongoose = require("mongoose");
const userData = require("../databases/userDatabase");
const { doctor } = require("./htmlController");

module.exports = {
    create : createSchedule,
    isValid : isValid,
    deleteSchedule:deleteSchedule,
    disabled:disabled,
    isDisabled:isDisabled,
    showDoctorScehdule:showDoctorScehdule,
    showSubSchedule:showSubSchedule,
    getNextAvailableSlot:getNextAvailableSlot,
    bookDoctorAppointment:bookDoctorAppointment,
    reschedule:reschedule
};


async function bookDoctorAppointment(req,res,next){
    var appointmentDate =req.params.appointmentDate;
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    if(req.session.user._id == req.params.doctorId){
        req.session.message = "Can't book your own schedule";
        req.session.messageType = "Failure";
        res.redirect("/doctor");
    }
    req.session.user.rescheduleStatus = false;
    if(req.params.appointmentId){
        req.session.user.rescheduleStatus = true;
        req.session.user.rescheduleId = req.params.appointmentId;
    }
       await userData.findById(req.params.doctorId)
       .then(doctor=>{
           for(var i=0;i<doctor.scheduleData.length;i++){
               if(doctor.scheduleData[i].isDisabled == false){
                   for(var j=0;j<doctor.scheduleData[i].subScheduleData.length;j++){
                       if(doctor.scheduleData[i].subScheduleData[j].disabled == false && doctor.scheduleData[i].subScheduleData[j].booked == false){
                           if(doctor.scheduleData[i].subScheduleData[j]._id == req.params.subScheduleId){
                            for(var k=0;k<7;k++){
                                if(days[k].substring(0,3) == appointmentDate.substring(0,3)){
                                    var temp = days[k]+","+appointmentDate.substring(3);
                                    req.session.user.appointmentDoctor = doctor;
                                    req.session.user.appointmentDate = temp;
                                    req.session.user.appointmentTime = doctor.scheduleData[i].subScheduleData[j].startTime;
                                    req.session.user.appointmentHospital = doctor.scheduleData[i].hospital;
                                    req.session.user.appointmentSubSchedule = req.params.subScheduleId;
                                    res.redirect("/bookDoctorAppointment");
                                }
                            }
                           }
                        }
                    }
                }
            }
        })
    }
                       


async function showDoctorScehdule(req,res){
    const doctor = await userData.findById(req.params.docId);
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var currentDay = new Date().getDay();
    var time = ""+new Date(new Date().getTime());
    time = time.substring(16,21);
    time = time.split(":");
    var slotCount = [0,0,0,0,0,0,0];
    var currentTime = parseInt(time[0])*60+parseInt(time[1]);
    var count = 0;
    while(count<7){
        for(var i = 0; i<doctor.scheduleData.length;i++){
            if(days[currentDay] == doctor.scheduleData[i].day && doctor.scheduleData[i].isDisabled == false){
                for(var j = 0; j<doctor.scheduleData[i].subScheduleData.length;j++){
                    if(doctor.scheduleData[i].subScheduleData[j].disabled == false  && doctor.scheduleData[i].subScheduleData[j].booked == false){
                        var tempStartTime = doctor.scheduleData[i].subScheduleData[j].startTime.split(":");
                    var start;
                    if(tempStartTime[1].substring(3) == "AM")
                    start = parseInt(tempStartTime[0])*60+parseInt(tempStartTime[1].substring(0,2));
                    else
                    start = parseInt(tempStartTime[0])*60+parseInt(tempStartTime[1].substring(0,2))+720;
                    if(start>= currentTime && count == 0){
                        slotCount[count] += 1;
                    }
                    if(count != 0){
                        slotCount[count] += 1;
                    }
                    }
                }
            }
        }
        count++;
        currentDay++;
        if(currentDay > 6)
        currentDay = 0;
    }
    res.json(slotCount);
}

async function showSubSchedule(req,res){
    const doctor = await userData.findById(req.params.docId);
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var currentDay = new Date().getDay();
    var requestDay = (currentDay+parseInt(req.params.n))%7;
    console.log(requestDay);
    var time = ""+new Date(new Date().getTime());
    time = time.substring(16,21);
    time = time.split(":");
    var slots = [];
    var slots_in_mins = [];
    var slotsId = [];
    var hospitalDaily = [];
    var currentTime = parseInt(time[0])*60+parseInt(time[1]);
        for(var i = 0; i<doctor.scheduleData.length;i++){
            if(days[requestDay] == doctor.scheduleData[i].day && doctor.scheduleData[i].isDisabled == false){
                for(var j=0;j<doctor.scheduleData[i].subScheduleData.length;j++){
                    if(doctor.scheduleData[i].subScheduleData[j].booked == false && doctor.scheduleData[i].subScheduleData[j].disabled == false){
                        var tempStartTime = doctor.scheduleData[i].subScheduleData[j].startTime.split(":");
                        var start;
                        if(tempStartTime[1].substring(3) == "AM")
                        start = parseInt(tempStartTime[0])*60+parseInt(tempStartTime[1].substring(0,2));
                        else
                        start = parseInt(tempStartTime[0])*60+parseInt(tempStartTime[1].substring(0,2))+720;
                        if(currentDay != requestDay){
                            slots.push(doctor.scheduleData[i].subScheduleData[j].startTime);
                            slots_in_mins.push(start);
                            hospitalDaily.push(doctor.scheduleData[i].hospital);
                            slotsId.push(doctor.scheduleData[i].subScheduleData[j]._id);
                        }
                        else{
                            if(start>=currentTime){
                                slots.push(doctor.scheduleData[i].subScheduleData[j].startTime);
                                slots_in_mins.push(start);
                                hospitalDaily.push(doctor.scheduleData[i].hospital);
                                slotsId.push(doctor.scheduleData[i].subScheduleData[j]._id);
                            }
                        }
                    }
                }
            }
        }
        if(slots_in_mins.length>0){
            for(var i=0;i<slots_in_mins.length;i++){
                for(var j=i+1;j<slots_in_mins.length;j++){
                    if(slots_in_mins[i]>slots_in_mins[j]){
                        var temp_slots_in_mins = slots_in_mins[i];
                        var temp_slots = slots[i];
                        var temp_hospitalDaily = hospitalDaily[i];
                        var temp_slotsId = slotsId[i];
                        slots_in_mins[i] = slots_in_mins[j];
                        slots[i] = slots[j];
                        hospitalDaily[i] = hospitalDaily[j];
                        slotsId[i] = slotsId[j];
                        slots_in_mins[j] = temp_slots_in_mins;
                        slots[j] = temp_slots;
                        hospitalDaily[j] = temp_hospitalDaily;
                        slotsId[j] = temp_slotsId;
                    }
                }
            }
        }
        var data =[];
        data.push(slots_in_mins,slots,hospitalDaily,slotsId);
        res.json(data);
    }

async function getNextAvailableSlot(req,res){
    const doctor = await userData.findById(req.params.docId);
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var currentDay = new Date().getDay();
    var requestDay = (currentDay+parseInt(req.params.n))%7+1;
    var count = 0;
    var flag = false;
    var nextSlotDay;
    console.log(requestDay);
    while(count<(6-parseInt(req.params.n))){
        for(var i=0;i<doctor.scheduleData.length;i++){
            if(doctor.scheduleData[i].day == days[requestDay] && doctor.scheduleData[i].isDisabled == false){
                for(var j =0;j<doctor.scheduleData[i].subScheduleData.length;j++){
                    if(doctor.scheduleData[i].subScheduleData[j].booked == false && doctor.scheduleData[i].subScheduleData[j].disabled == false){
                        if(flag == false){
                            flag = true;
                            nextSlotDay = requestDay;
                        }
                    }
                }
            }
        }
            count++;
           requestDay = (requestDay+1)%7
    }  
    var ans;
    requestDay = (currentDay+parseInt(req.params.n))%7;
    console.log(nextSlotDay,requestDay);
    if(flag == false)
    ans = 0; 
    else{
        if(nextSlotDay < requestDay)
        ans =6-currentDay+nextSlotDay+1;
        else
        ans = nextSlotDay - currentDay;
    }   
    console.log(ans);
    res.json(ans); 
}

async function isDisabled(req,res){
    var id = req.params.scheduleId;
    userData.findById(req.session.user._id)
    .then(async function (user){
        for(var i =0; i<user.scheduleData.length;i++)
        {
            console.log(user.scheduleData[i].isDisabled);
            if(user.scheduleData[i]._id == id)
            {
                if(req.body.isDisabled){
                user.scheduleData[i].isDisabled = true;
                user.save();
                req.session.user = user;
                req.session.messageType = "Success";
                req.session.message = "Schedule disabled successfully"
                res.redirect("/createSchedule");
                }
                else{
                user.scheduleData[i].isDisabled = false;
                user.save();
                req.session.user = user;
                req.session.messageType = "Success";
                req.session.message = "Schedule enabled successfully"
                res.redirect("/createSchedule");
                }
            }
        }
    })
}


async function disabled(req,res){
    var id = req.params.subScheduleId;
    console.log(id);
    userData.findById(req.session.user._id)
    .then(async function (user){
        for(var i=0;i<user.scheduleData.length;i++)
        {
            for(var j=0;j<user.scheduleData[i].subScheduleData.length;j++)
            {
                if(user.scheduleData[i].subScheduleData[j]._id == id)
                {
                    console.log(user.scheduleData[i].subScheduleData[j]._id);
                    if(req.body.book)
                    user.scheduleData[i].subScheduleData[j].disabled = true;
                    else
                    user.scheduleData[i].subScheduleData[j].disabled = false;
                }
            }
        }
        await user.save();
        req.session.user = user;
        req.session.message = "Schedule Updated Successfully";
        req.session.messageType = "Success";
        console.log("Schedule Updated");
        res.redirect("/createSchedule");
    })
    .catch(err=>{
        req.session.user = user;
        req.session.message = "Some error occured.";
        req.session.messageType = "Failure";
        res.redirect("/createSchedule");
    })
}

async function deleteSchedule(req,res){
    let schedule= await userData.findOneAndUpdate({_id:req.session.user},
        {
            $pull:{"scheduleData":{_id: req.params.scheduleId} }
        })
        req.session.message = "Schedule successfully deleted.";
        req.session.messageType = "Success";
    req.session.user = await userData.findOne({_id: req.session.user._id});
    res.redirect("/createSchedule");
}


function isValid(req,res,next){
                var start = req.body.startTime.split(":");
                var end = req.body.endTime.split(":");
                var startHour = parseInt(start[0]);
                var endHour = parseInt(end[0]);
                var startMin = parseInt(start[1]);
                var endMin = parseInt(end[1]);
                var requested_startTime = startHour*60+startMin;
                var requested_endTime = endHour*60+endMin;
                if(requested_endTime<=requested_startTime)
                {
                    req.session.message = "Not valid schedule.";
                    req.session.messageType = "Failure";
                    res.redirect("/createSchedule");
                }
                    for(var i =0;i<req.session.user.scheduleData.length;i++){
                        var s = ""+req.session.user.scheduleData[i].startTime;
                        var e = ""+req.session.user.scheduleData[i].endTime;
                        if(s.substring(6) == "AM")
                        var start = parseInt(s.substring(0,2))*60+parseInt(s.substring(3,5));
                        else
                        var start = parseInt(s.substring(0,2))*60+parseInt(s.substring(3,5))+720;
                        if(e.substring(6) == "AM")
                        var end = parseInt(e.substring(0,2))*60+parseInt(e.substring(3,5));
                        else
                        var end = parseInt(e.substring(0,2))*60+parseInt(e.substring(3,5))+720;
                        for(var j=0;j<req.body.days.length; j++)
                        {
                            if(req.session.user.scheduleData[i].day == req.body.days[j]){
                                if((requested_startTime>=start && requested_startTime<=end) || requested_endTime>=start && requested_endTime<=end)
                                {
                                    req.session.message = "Not valid schedule.";
                                    req.session.messageType = "Failure";
                                    res.redirect("/createSchedule");
                                }
                            }
                        }
                    }
                next();
}


async function createSchedule(req,res){
   userData.findById(req.session.user._id)     
        .then(async function(user){
            console.log(req.body.days);
            var start = req.body.startTime.split(":");
            var end = req.body.endTime.split(":");
            var startHour = parseInt(start[0]);
            var endHour = parseInt(end[0]);
            var startMin = parseInt(start[1]);
            var endMin = parseInt(end[1]);
            var interval = parseInt(req.body.interval);
            var finalStart, finalEnd;
            if(startHour>=12)
            {
                if((startHour-12)<10)
                finalStart = "0"+(startHour-12)+":";
                else
                finalStart = (startHour-12)+":";
                if(startMin<10)
                finalStart+= "0"+startMin+ " PM";
                else
                finalStart+= startMin+ " PM";
                if((endHour-12)<10)
                finalEnd = "0"+(endHour-12)+":";
                else
                finalEnd = (endHour-12)+":";
                if(endMin<10)
                finalEnd+= "0"+endMin+ " PM";
                else
                finalEnd+= endMin+ " PM";
            }
            else if(endHour>=12)
            {
                finalStart = req.body.startTime +" AM";
                if((endHour-12)<10)
                finalEnd = "0"+(endHour-12)+":";
                else
                finalEnd = (endHour-12)+":";
                if(endMin<10)
                finalEnd+= "0"+endMin+ " PM";
                else
                finalEnd+= endMin+ " PM";
            }
            else{
                finalStart = req.body.startTime+ " AM";
                finalEnd = req.body.endTime + " AM";
            }

            var start_time = startHour*60 + startMin;
            var end_time = endHour*60 + endMin;

        for(var j=0;j<req.body.days.length;j++){
            user.scheduleData.push({
                day:req.body.days[j],
                hospital:req.body.hospitals,
                startTime:finalStart,
                endTime:finalEnd,
                interval:req.body.interval,
            });
        }
        await user.save();
        var n = user.scheduleData.length-req.body.days.length;
            while((start_time+interval)<=end_time){
                var s = "";
                var e="";
                if(parseInt(start_time/60)>=12)
                {
                    if((parseInt(start_time/60)%12)<10)
                    s += "0"+(parseInt(start_time/60)%12)+":";
                    else
                    s+=(parseInt(start_time/60)%12)+":";
                    if((start_time%60)%60<10)
                    s+="0"+(start_time%60)+" PM";
                    else
                    s+=(start_time%60)+" PM";
                    start_time += interval;
                    if((parseInt(start_time/60)%12)<10)
                    e += "0"+(parseInt(start_time/60)-12)+":";
                    else
                    e+=(parseInt(start_time/60)%12)+":";
                    if((start_time%60)%60<10)
                    e+="0"+(start_time%60)+" PM";
                    else
                    e+=(start_time%60)+" PM";
                }
                else{
                    if((parseInt(start_time/60)%12)<10)
                    s += "0"+(parseInt(start_time/60)%12)+":";
                    else
                    s+=(parseInt(start_time/60)%12)+":";
                    if((start_time%60)%60<10)
                    s+="0"+(start_time%60)+" AM";
                    else
                    s+=(start_time%60)+" AM";
                   start_time += interval;
                   if(parseInt(start_time/60)>=12)
                   {
                    if((parseInt(start_time/60)%12)<10)
                    e += "0"+(parseInt(start_time/60)%12)+":";
                    else
                    e+=(parseInt(start_time/60)%12)+":";
                    if((start_time%60)%60<10)
                    e+="0"+(start_time%60)+" PM";
                    else
                    e+=(start_time%60)+" PM";
                   }
                   else
                   {
                    if((parseInt(start_time/60)%12)<10)
                    e += "0"+(parseInt(start_time/60)%12)+":";
                    else
                    e+=(parseInt(start_time/60)%12)+":";
                    if((start_time%60)%60<10)
                    e+="0"+(start_time%60)+" AM";
                    else
                    e+=(start_time%60)+" AM";
                   }
                }
                for(var i=n;i<user.scheduleData.length;i++){
                user.scheduleData[i].subScheduleData.push({
                    startTime:s,
                    endTime:e
                });
            }
        }
        if((start_time+interval)>end_time && start_time!=end_time)
        {
            var s = "";
            var e="";
            if(parseInt(start_time/60)>=12)
            {
                if((parseInt(start_time/60)%12)<10)
                s += "0"+(parseInt(start_time/60)%12)+":";
                else
                s+=(parseInt(start_time/60)%12)+":";
                if((start_time%60)%60<10)
                s+="0"+(start_time%60)+" PM";
                else
                s+=(start_time%60)+" PM";
            }
            else{
                if((parseInt(start_time/60)%12)<10)
                s += "0"+(parseInt(start_time/60)%12)+":";
                else
                s+=(parseInt(start_time/60)%12)+":";
                if((start_time%60)%60<10)
                s+="0"+(start_time%60)+" AM";
                else
                s+=(start_time%60)+" AM";
            }
            if(parseInt(end_time/60)>=12)
            {
                if((parseInt(end_time/60)%12)<10)
                e += "0"+(parseInt(end_time/60)%12)+":";
                else
                e+=(parseInt(end_time/60)%12)+":";
                if((end_time%60)%60<10)
                e+="0"+(start_time%60)+" PM";
                else
                e+=(end_time%60)+" PM";
            }
            else{
                if((parseInt(end_time/60)%12)<10)
                e += "0"+(parseInt(end_time/60)%12)+":";
                else
                e+=(parseInt(end_time/60)%12)+":";
                if((end_time%60)%60<10)
                e+="0"+(start_time%60)+" AM";
                else
                e+=(end_time%60)+" AM";
            }
            for(var i=n;i<user.scheduleData.length;i++){
                user.scheduleData[i].subScheduleData.push({
                    startTime:s,
                    endTime:e
                }); 
            } 
        }

        await user.save();
        req.session.user = user;
        req.session.message = "Schedule Updated Successfully";
        req.session.messageType = "Success";
        console.log("Schedule Updated");
        res.redirect("/createSchedule");
        })
        .catch(err=>{
            req.session.message = "Some Error Occured.";
            req.session.messageType = "Failure";
            res.redirect("/createSchedule");
        })
}


async function reschedule(req,res){
    for(var i=0;i<req.session.user.appointmentData.length;i++){
        if(req.session.user.appointmentData[i]._id == req.params.appointmentId){
            req.session.user.appointmentDetails = req.session.user.appointmentData[i];
            res.redirect("/rescheduleAppointment");
        }
    }
}