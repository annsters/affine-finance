const http = require('http');
var express=require('express');
var cors = require('cors');
var parse = require('csv-parse');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var request = require('request');
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
var namecoord={}
let addresses = []
app.get('/loadCSV',function(req,res){
    console.log('request recieved')
    var inputFile='Book2.csv';
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
      }
      })
    })
  }})
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
