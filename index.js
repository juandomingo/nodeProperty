var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var controller = require('./controller.js');
app.set('view engine', 'jade');
app.use(bodyParser.json({ extended: true }));
app.use(express.static('public'));


/*
  SOCKET IO
*/

var handleClient = function(socket){

  var enviar = function(data,socketName){socket.emit(socketName, data);}

  var queryA = function(data){
    controller.getResultsQueryA(data.postcode,data.radius, data.days, data.queryname , enviar);
  }

  var queryB = function(data){
    controller.getResultsQueryB(data.queryID,function(datas){enviar(datas,"queryBResult");});
    //console.log('queryB recibida' + data.queryID + data.typeID + data.valueMin + data.valueMax);
    //enviar({'id':'10','type':"detached",'postcode':"NW3 3AY",'value':"15000",'agent':"roberto hermanos",'agentpostcode':"NW3 2AY"},"queryBResult");

  }

  var getQueries = function(){
    controller.getQueries(function(data){enviar(data,"getQueries");});
  }

  var getTypes = function(){
    controller.getTypes(function(data){enviar(data,"getTypes");});
  }

  socket.on('queryA', queryA);
  socket.on('queryB', queryB);
  socket.on('getQueriesC', getQueries);
  socket.on('getTypesC', getTypes);
}
io.sockets.on('connection', handleClient);



/*
  WEB APP
*/
app.get('/', function(req, res) {
  res.render('index',{layout:false, message:"hello loquito", title:"Holix loquix!"});
});


server.listen(3000, function(){
  console.log("Listen on port 3000\n");
});
