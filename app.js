const http = require('http');
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
const port = 3000;

const server = http.createServer((req,res)=>{
  res.statusCode=200;
  res.setHeader('Content-type','text/plain');
  res.end('Hello World');
});

server.listen(port,hostname, ()=>{
  console.log('Server started on port '+port);
});
