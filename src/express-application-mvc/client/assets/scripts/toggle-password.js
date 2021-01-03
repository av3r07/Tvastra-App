var visiblePassword=document.getElementById("visiblePassword")
var hiddenPassword=document.getElementById("hiddenPassword")
var password_input=document.getElementById("password");
var new_password_input = document.getElementById("new_password");
visiblePassword.addEventListener("click",function(){
    visiblePassword.style.display="none";
    hiddenPassword.style.display="block";
    password_input.type="password";
    new_password_input.type="password";
});

hiddenPassword.addEventListener("click",function(){
    visiblePassword.style.display="block";
    hiddenPassword.style.display="none";
    password_input.type="text";
    new_password_input.type="text";
});

