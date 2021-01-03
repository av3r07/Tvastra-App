var image_mobile = document.getElementsByClassName("imageWorkList-mobile");
var item = document.getElementsByClassName("work_list_item");
var web_iamges = document.getElementById("imageWorkList_image");
var images = web_iamges.getElementsByTagName("img");
var img_sec = document.getElementById("imageWorkList");
var heading = img_sec.querySelectorAll("h3");

if(screen.width<768){
  for(var i=0;i<image_mobile.length;i++)
  {
    item[i].setAttribute("id","");
    image_mobile[i].style.display = "none";
  }
item[0].setAttribute("id","active");
image_mobile[0].style.display = "block";}
else{
  img_sec.style.display = "block";
  for(var i=0;i<images.length;i++)
  {
    item[i].setAttribute("id","");
    images[i].style.display = "none";
    heading[i].style.display="none";
  }
  heading[0].style.display = "block"
  images[0].style.display = "block"
  item[0].setAttribute("id","active");
}

function show(n){
  if(screen.width<768)
  {
    for(var i=0;i<image_mobile.length;i++)
  {
    item[i].setAttribute("id","");
    image_mobile[i].style.display = "none";
  }
  image_mobile[n-1].style.display = "block"
  item[n-1].setAttribute("id","active");
  }
  else{
    for(var i=0;i<images.length;i++)
  {
    item[i].setAttribute("id","");
    images[i].style.display = "none";
    heading[i].style.display = "none";
  }
  heading[n-1].style.display = "block";
  images[n-1].style.display = "block"
  item[n-1].setAttribute("id","active");
  }
}





var doctor_slideIndex = 0;
doctorCarousel();

function doctorCarousel()
{
  if(doctor_slideIndex<=3)
  doctor_slideIndex++;
  else
  doctor_slideIndex = 1;
  showSlides(doctor_slideIndex-1);
  setTimeout(doctorCarousel,5000);
}

function currentSlide(n){
  doctor_slideIndex = n;
  showSlides(n);
}

function showSlides(n){
  const slides = document.querySelectorAll(".doctor-slide");
  const dots = document.querySelector(".dots");
  const slide_indicator = dots.querySelectorAll("i");

  for(var i=0;i<slides.length;i++){
    slides[i].style.display = "none";
    slide_indicator[i].classList.remove("active");
  }
  slides[n].style.display = "block";
  slide_indicator[n].classList.add("active");  
}




var card_slideIndex = 0;
cardCarousel();

function cardCarousel()
{
  if(card_slideIndex<=2)
  card_slideIndex++;
  else
  card_slideIndex = 1;
  showSlideCard(card_slideIndex-1);
  setTimeout(cardCarousel,2000);
}

function currentSlideCard(n){
  card_slideIndex = n;
  showSlideCard(n);
}

function showSlideCard(n){
  const slides = document.querySelectorAll(".card");
  const dots = document.querySelector(".dots_treatment");
  const slide_indicator = dots.querySelectorAll("i");

  for(var i=0;i<slides.length;i++){
    slides[i].style.display = "none";
    slide_indicator[i].classList.remove("active");
  }
  slides[n].style.display = "grid";
  slide_indicator[n].classList.add("active");  
}





