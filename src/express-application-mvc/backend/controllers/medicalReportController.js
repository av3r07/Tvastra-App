const mongoose = require("mongoose");
const userData = require("../databases/userDatabase");
const medicalReport = require("../databases/medicalReportsDatabase");
const { nextTick } = require("process");
mongoose.set('useFindAndModify', false);



module.exports = {
  add: addReport,
  delete: deleteReport,
  deleteReportPic:deleteReportPic,
  updateMedicalReport:updateMedicalReport
};

async function addReport(req, res) {
  if(!req.files)
  {
    req.session.message = "Please check type of report Or Select a Image";
      req.session.messageType = "Failure";
      res.redirect("/medicalReports");
  }
  else{
    var image = [];
      for (var m = 0; m < req.files.length; m++) {
        image.push(req.files[m].filename);
      }
      userData.findById(req.session.user._id)
      .then(async function (user){
        user.medicalReportData.push({
          reports: image,
        title: req.body.title, 
        name : req.body.name,
        dateOfReport: req.body.date,
        typeOfReport: req.body.typeOfReport
        });
        req.session.user = await user.save();
        req.session.message = "Report Uploaded Successfully";
        req.session.messageType = "Success";
        console.log("Report Uploaded");
        res.redirect("/medicalReports");
      })
      .catch(err=> {
        console.log("Error occured", err)
        req.session.message = "Error Uploading Report ";
        req.session.messageType = "Failure";
        res.redirect("/medicalReports");
      })
  }
}


async function deleteReport(req,res){
  let userreport = await userData.findOneAndUpdate({_id:req.session.user},
    {
        $pull:{"medicalReportData":{_id: req.params.reportId} }
    })
    req.session.message = "Report successfully deleted.";
    req.session.messageType = "Success";
req.session.user = await userData.findOne({_id: req.session.user._id});
res.redirect("/medicalReports");
  }


  async function deleteReportPic(req,res){
    const reportId  = req.params.reportId;
    const picNumber = parseInt(req.params.picNumber);
    console.log(picNumber);
    console.log(reportId);
    var n;
    userData.findById(req.session.user._id)
    .then(async function(user){
      const a=[];
      for(var i = 0; i<user.medicalReportData.length; i++)
      {
        console.log(user.medicalReportData[i]._id);
        if(user.medicalReportData[i]._id == reportId)
        {
          n =i;
          for(var j =0 ;j<user.medicalReportData[i].reports.length;j++)
          {
            if(j != picNumber)
            a.push(user.medicalReportData[i].reports[j]);
          }
        } 
      }
      user.medicalReportData[n].reports = a;
          user.save();
          req.session.user = user;
          res.redirect("/showReport/"+user.medicalReportData[n]._id);
    })
  }


  async function updateMedicalReport(req,res){
    const reportId = req.params.reportId;
    if(!req.files)
  {
    req.session.message = "Select a Image";
      req.session.messageType = "Failure";
      res.redirect("/showReport/"+reportId);
  }
  else{

      userData.findById(req.session.user._id)
      .then(async function (user){
        for(var i = 0;i<user.medicalReportData.length;i++)
        {
          if(user.medicalReportData[i]._id == reportId)
          {
            for (var m = 0; m < req.files.length; m++) {
              user.medicalReportData[i].reports.push(req.files[m].filename);
            }
          }
        }
        req.session.user = await user.save();
        req.session.message = "Report Uploaded Successfully";
        req.session.messageType = "Success";
        console.log("Report Uploaded");
        res.redirect("/showReport/"+reportId);
      })
      .catch(err=> {
        console.log("Error occured", err)
        req.session.message = "Error Uploading Report ";
        req.session.messageType = "Failure";
        res.redirect("/medicalReports");
      })
  }
  }