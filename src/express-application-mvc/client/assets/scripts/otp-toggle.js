var digit1 = document.getElementById("digit1");
var digit2 = document.getElementById("digit2");
var digit3 = document.getElementById("digit3");
var digit4 = document.getElementById("digit4");
var Resend = document.getElementById("resend");
var H3 = document.getElementById("h3");

var count=30;
var counter=setInterval(timer, 1000);

function timer()
{
    H3.innerHTML = "Resend in "+count;
  count=count-1;
  if (count <= 1)
  {
     clearInterval(counter);
     H3.innerHTML = "Resend";
     Resend.onclick = "location.href='/otpLogin'";
     return;
  }
}


digit1.focus();

digit1.addEventListener("keyup",function(){
    if(digit1.value.length == 1)
    {
        digit2.focus();
        digit1.blur();
    }
    if(event.keyCode == 8)
     {
         digit1.focus();
     }
})

digit2.addEventListener("keyup",function(){
    if(digit2.value.length == 1)
    {
        digit3.focus();
        digit2.blur();
    }
    if(event.keyCode == 8)
     {
         digit1.focus();
     }
})

digit3.addEventListener("keyup",function(){
    if(digit3.value.length == 1)
    {
        digit4.focus();
        digit3.blur();
    }
    if(event.keyCode == 8)
     {
         digit2.focus();
     }
})

 digit4.addEventListener("keyup",function(){
     if(event.keyCode == 8)
     {
         digit3.focus();
     }
 })