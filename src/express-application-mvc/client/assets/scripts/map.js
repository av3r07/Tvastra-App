var arr = [
      { id: 15 },
      { id: -1 },
      { id: 0 },
      { id: 3 },
      { id: 12.2 },
      {},
      { id: null },
      { id: NaN },
      { id: "undefined" }
    ];
    function abc(obj)
{
    var prop1={},prop2={},i=0,j=0;
    for(var k in obj)
    {
        if(obj[k]['id']==null || isNaN(obj[k]['id'])==true || obj[k]['id']=='undefinded' || obj[k]['id']==0 || obj[k]=={}){
            console.log(obj[k]['id']);
        ++i;}
        else
        {
            prop1[j]=obj[k];
            j++;
        }
    }
    console.log(prop1);
    abc(arr);
}
