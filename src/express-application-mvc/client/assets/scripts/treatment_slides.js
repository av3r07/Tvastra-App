var slide_index = 0;
show_slide();

function prevslide()
{
    slide_index--;
    if(slide_index<0)
    slide_index=2;
    show_slide(slide_index);
}

function nextslide()
{
    slide_index++;
    if(slide_index>2)
    slide_index=0;
    show_slide();
}

function show_slide(){
    const slides = document.getElementsByClassName("service");
    for(var i=0;i<slides.length;i++)
    slides[i].style.display = "none";
    slides[slide_index].style.display = "grid";
}
