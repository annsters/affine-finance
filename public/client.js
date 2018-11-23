
function fnc()
{
  console.log('hi')
  const Http=new XMLHttpRequest();
  const url="http://localhost:80/loadCSV"
  Http.open("GET", url);
  Http.send()
}
