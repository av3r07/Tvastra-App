const tagContainer = document.querySelector('#hospital_tag_container');
const input = document.querySelector('#hospitals-duplicate');

let tags = [];




function createTag(label,n) {
  const div = document.createElement('div');
  div.setAttribute('class', 'tag');
  const span = document.createElement('span');
  span.innerHTML = label;
  const closeIcon = document.createElement('i');
  var remove = "remove("+n+")";
  closeIcon.setAttribute("onclick",remove);
  closeIcon.setAttribute('class', "fas fa-times");
  div.appendChild(span);
  div.appendChild(closeIcon);
  return div;
}
function clearTags() {
    document.querySelectorAll('.tag').forEach(tag => {
    tag.parentElement.removeChild(tag);
  });
}

function addTags() {
  clearTags();
  var n=1;
  tags.forEach(tag=>{      
      tagContainer.prepend(createTag(tag,n));
      n++;
  })
}

input.addEventListener('keyup', () => {
    var tag = input.value;
    var n = tag.length;  
    var check = 0;
    if(tag.charAt(n-1) == ",")
    {
        if(tag.slice(0,n-1).trim()!=""){
        for(var i=0;i<tags.length;i++)
        if(tags[i] == tag.slice(0,n-1))
            check = 1;
            if(check == 0)
    {
        tags.unshift(tag.slice(0,n-1));
        addTags();
        input.value = "";
    }
    else{
        check = 0;
        input.value = "";
    }}
    else{
        input.value="";
    }
    }
});


function remove(n)
{
    var tag = document.getElementsByClassName("tag");
    var span = tag[tags.length-n].querySelector("span").innerHTML;
    for(var i=0;i<tags.length;i++){
    if(tags[i]==span)
    tags.splice(i,1);}
    addTags();
}