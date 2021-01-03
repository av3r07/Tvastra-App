
var input = document.querySelector('#search');
var inputSearchValue="";
var doctors = ["Charlie Moon","Georgia Peter","Asha Mehta","Abhishek Verma","Rose Maroon","Duke Sanson","Leslie Patel","Dipika Singh","Karan Singhania"];
var treatments = ["Cancer","Physiotherapy","Neurology","Cardiology","Orthopedics","Dentistry","Infertility","Multi Organ Transplant"];
var hospitals =["Apollo","Rockland","Primus Super Speciality","Fortis"];

function autocomplete(val){

  let autocompleteResults = [];

  for (i = 0; i < doctors.length; i++) {
    if (val.toUpperCase() === doctors[i].toUpperCase().slice(0, val.length)) {
      autocompleteResults.push(doctors[i]);
    }
  }

  for (i = 0; i < hospitals.length; i++) {
    if (val.toUpperCase() === hospitals[i].toUpperCase().slice(0, val.length)) {
      autocompleteResults.push(hospitals[i]);
    }
  }

  for (i = 0; i < treatments.length; i++) {
    if (val.toUpperCase() === treatments[i].toUpperCase().slice(0, val.length)) {
      autocompleteResults.push(treatments[i]);
    }
  }

  return autocompleteResults;
}

input.addEventListener("keyup",function(){
  let inputVal = this.value;
  let results = document.querySelector("#search-results")
  let matchResults=[];
  matchResults= autocomplete(inputVal);
  results.innerHTML="";

  if(inputVal.length>0){
    if(matchResults.length < 1)
      results.innerHTML += "<li>"+"Data Not found"+"</li>"; 

    else{
      for(var i in matchResults){
      const list = document.createElement("li");
      list.innerHTML=matchResults[i];
      list.setAttribute("id","list-items");
      results.appendChild(list);

      list.addEventListener("click",function(){
        input.value = this.innerHTML;
        inputSearchValue = this.innerHTML;
        results.style.display="none";
      })
      }

      results.style.display="block";
    }
  }
  else{
    matchResults=[];
    results.innerHTML="";
  }
})

var searchPage = document.querySelector("#search-btn");

searchPage.addEventListener("click",function(){
  for(i in doctors)
  {
    if(inputSearchValue == doctors[i])
    searchPage.setAttribute("onclick","location.href='doctorProfile'")
  }

  for(i in hospitals)
  {
    if(inputSearchValue == hospitals[i])
    searchPage.setAttribute("onclick","location.href='aboutHospital'")
  }

  for(i in treatments)
  {
    if(inputSearchValue == treatments[i])
    searchPage.setAttribute("onclick","location.href='dentistry'")
  }

})