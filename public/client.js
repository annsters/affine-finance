mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uc3RlcnMiLCJhIjoiY2pvdXllODBwMWgyMDN0cGlmMjVwYnBqNyJ9.pPpGa4YC_onuauHoatHRXw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-96, 37.8],
    zoom: 3
});
function fnc()
{
  console.log('hi')
  const Http=new XMLHttpRequest();
  const url="http://localhost:80/loadCSV"
  Http.open("GET", url);
  Http.send()
}
function submit()
{
  const Http=new XMLHttpRequest();
  var name = document.getElementById('textfield').valueS
  const url="https://affine--finance.herokuapp.com/input?name="+name
  Http.open("GET", url);
  Http.onreadystatechange = function() {
    if(Http.readyState == XMLHttpRequest.DONE) {
      if (Http.status == 200) {
        var coords=JSON.parse(Http.response)
        console.log(Http.response)

    map.addLayer({
       "id": name + "-point",
       "type": "symbol",
       "source": {
           "type": "geojson",
           "data": {
               "type": "FeatureCollection",
               "features": [{
                   "type": "Feature",
                   "geometry": {
                       "type": "Point",
                       "coordinates": [parseFloat(coords['long']), parseFloat(coords['lat'])]
                   },
                   "properties": {
                       "title": name,
                       "icon": "hospital"
                   }
               }]
           }
       },
       "layout": {
           "icon-image": "{icon}-15",
           "text-field": "{title}",
           "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
           "text-offset": [0, 0.6],
           "text-anchor": "top"
       }
   });
  }
}
}
Https.send()
}
