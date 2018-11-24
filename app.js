const http = require('http');
var express=require('express');
var cors = require('cors');
var parse = require('csv-parse');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var request = require('request');
var data=require("./latlong.json")
var MongoClient= require('mongodb').MongoClient,format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017', function(err,db){
  if(err){
    throw err;
  } else{
    console.log("connected");
  }
  db.close();
});
const hostname= '127.0.0.1';

const server = http.createServer((req,res)=>{
  res.statusCode=200;
  res.setHeader('Content-type','text/plain');
  res.end('Hello World');
});
var app=express();
// app.get('/test', function(req,res){
//   res.sendFile('views/test.html',{root: __dirname})
// });
app.use(cors())
const port = process.env.PORT || 80;
app.use(express.static('public'))
app.listen(port);
console.log("App started on port " + port);
// server.listen(port,hostname, ()=>{
//   console.log('Server started on port '+port);
// });
app.get('/input',function(req,res){
  console.log(req.query['name'])
  console.log(data)
  console.log(data[req.query['name']])
  res.send(JSON.stringify(data[req.query['name']]))
})

//
// map.on('load', function () {
//
//     map.addLayer({
//         "id": "points",
//         "type": "symbol",
//         "source": {
//             "type": "geojson",
//             "data": {
//                 "type": "FeatureCollection",
//                 "features": [{
//                     "type": "Feature",
//                     "geometry": {
//                         "type": "Point",
//                         "coordinates": [data[req.query['name']]['lat'], data[req.query['name']]['long']]
//                     },
//                     "properties": {
//                         "title": "Mapbox DC",
//                         "icon": "monument"
//                     }
//                 }]
//             }
//         },
//         "layout": {
//             "icon-image": "{icon}-15",
//             "text-field": "{title}",
//             "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
//             "text-offset": [0, 0.6],
//             "text-anchor": "top"
//         }
//     });
// });

var namecoord={}
let addresses = []
app.get('/loadCSV',function(req,res){
    console.log('request recieved')
    var inputFile='twohundred.csv';
    console.log("Processing Countries file");
    var parser = parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' }, function(err,data){
      console.log(err)
      data.forEach(function(line){
        if (line[31]!=="" && line[33]!=="" && line[34]!=="" && line[35]!=="" && line[36]!=="") {

          var address={"name":line[27]+"|"+line[28]+"|"+line[29],
            "streetaddress": line[31],
                      "city":line[33],
                    "state": line[34],
                  "zip": line[35],
                "country":line[36]};
        addresses.push(address)

      }
    });

    console.log("addresses"+addresses)

    // const Http= new XMLHttpRequest()
    for (let i=0; i<addresses.length; i++){
    const url="https://usgeocoder.com/api/get_info.php?address="+addresses[i]["streetaddress"]+"&zipcode="+addresses[i]["zip"]+"&authkey=d6466c1d70a167944018fca49b16ed56"
    request(url, function(err, response, body) {
      console.log('body: ' + body)
      parseString(body, function(err, result) {
        dictlatlong={}
        console.log(JSON.stringify(result))
        // console.log(result['usgeocoder'])
        // console.log(result['usgeocoder']['geo_info'][0]['latitude'][0])
        // console.log(result['usgeocoder']['geo_info'][0]['longitude'][0])
        console.log(result['usgeocoder']['request_status'][0]['request_status_code'][0]["_"])
        if (result['usgeocoder']['request_status'][0]['request_status_code'][0]["_"]!=="NoMatch"){
        dictlatlong["lat"]=result['usgeocoder']['geo_info'][0]['latitude'][0]
        dictlatlong["long"]=result['usgeocoder']['geo_info'][0]['longitude'][0]
        namecoord[addresses[i]["name"]]=dictlatlong
        console.log(namecoord)
        var json=JSON.stringify(namecoord);
        fs.writeFile('latlong.json',json,'utf8',function(){
          console.log("one record added")
        });
      }
      })
    })
  }

})



    fs.createReadStream(inputFile).pipe(parser);

    // Http.open("GET",url);
    // Http.responseType="document";
    // Http.onload=function(){
    //   console.log("latitude")
    //   console.log(Http.responseXML.getElementsByTagName("latitude")[0])
    //   console.log(Http.responseXML.getElementsByTagName("longitude")[0])
    // }
    // Http.send();

})
