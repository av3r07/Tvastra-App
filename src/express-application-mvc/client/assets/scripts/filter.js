
function input_show(n)
{
    var label = document.getElementsByTagName("label");
    var filterList = document.getElementById("selected-filters");
    var input = document.getElementById(label[n-1].for);
    var filter = filterList.querySelectorAll("li");

    for(var i=0;i<filter.length;i++)
    {
        if(filter[i].innerHTML == label[n-1].innerHTML){
        filterList.removeChild(filter[i]);
        return;}
    }

    var li = document.createElement("li");
    li.innerHTML = label[n-1].innerHTML;
    filterList.appendChild(li);
}
