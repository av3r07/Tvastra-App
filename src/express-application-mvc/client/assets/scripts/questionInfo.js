function showInfo(n){
    var list = document.getElementsByClassName("list");
    var down = document.getElementsByClassName("info-down");
    var up = document.getElementsByClassName("info-up");
    
    down[n-1].style.display = "none";
    up[n-1].style.display = "block"

    var p = document.createElement("p");
    p.innerHTML = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    list[n-1].appendChild(p);
}

function hideInfo(n){
    var list = document.getElementsByClassName("list");
    var down = document.getElementsByClassName("info-down");
    var up = document.getElementsByClassName("info-up");
    
    up[n-1].style.display = "none";
    down[n-1].style.display = "block"
    var p = list[n-1].querySelector("p");
    p.remove();
}