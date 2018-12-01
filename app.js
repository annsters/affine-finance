const http = require('http');
var express=require('express');
var cors = require('cors');
var parse = require('csv-parse');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var request = require('request');
var data=require("./latlong.json")
// var MongoClient= require('mongodb').MongoClient,format = require('util').format;
// var mongodb = require("mongodb");
// mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }
// MongoClient.connect('mongodb://127.0.0.1:27017', function(err,db){
//   if(err){
//     throw err;
//   } else{
//     console.log("connected");
//   }
//   db.close();
// });

const hostname= '127.0.0.1';
const path=require('path')

const server = http.createServer((req,res)=>{
  res.statusCode=200;
  res.setHeader('Content-type','text/plain');
  res.end('Hello World');
});

var app=express();
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname, 'public/test.html'))
});
app.get('/input',function(req,res){

  res.send(JSON.stringify(data[req.query['name']]))
})

app.use(cors())
const port = process.env.PORT || 80;
app.use(express.static('public'))
app.listen(port);
console.log("App started on port " + port);

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8000;
// }
// app.listen(port);
//



var namecoord={}
let addresses = []
app.get('/loadCSV',function(req,res){
    console.log('request recieved')
    var inputFile='twohundred.csv';

    var parser = parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' }, function(err,data){
      console.log(err)
      data.forEach(function(line){
        if (line[31]!=="" && line[33]!=="" && line[34]!=="" && line[35]!=="" && line[36]!=="") {
          if (line[28]!=""){
          var address={"name":line[27]+" "+line[28]+" "+line[29],
            "streetaddress": line[31],
                      "city":line[33],
                    "state": line[34],
                  "zip": line[35],
                "country":line[36]};
          }
          else if (line[28]=""){
            var address={"name":line[27]+" "+line[29],
              "streetaddress": line[31],
                        "city":line[33],
                      "state": line[34],
                    "zip": line[35],
                  "country":line[36]};
          }

        addresses.push(address)

      }
    });


    for (let i=0; i<addresses.length; i++){
    const url="https://usgeocoder.com/api/get_info.php?address="+addresses[i]["streetaddress"]+"&zipcode="+addresses[i]["zip"]+"&authkey=d6466c1d70a167944018fca49b16ed56"
    request(url, function(err, response, body) {

      parseString(body, function(err, result) {
        dictlatlong={}

        if (result['usgeocoder']['request_status'][0]['request_status_code'][0]["_"]!=="NoMatch"){
        dictlatlong["lat"]=result['usgeocoder']['geo_info'][0]['latitude'][0]
        dictlatlong["long"]=result['usgeocoder']['geo_info'][0]['longitude'][0]
        namecoord[addresses[i]["name"]]=dictlatlong

        var json=JSON.stringify(namecoord);
        fs.writeFile('latlong.json',json,'utf8',function(){

        });
      }
      })
    })
  }

})



    fs.createReadStream(inputFile).pipe(parser);


})
