var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var zooplaHandler = require('./zooplaHandler.js');
var rightmoveHandler = require('./rightmoveHandler.js');

app.set('view engine', 'jade');
app.use(bodyParser.json({ extended: true }));






app.get('/', function(req, res) {
  res.render('index',{layout:false, message:"hello loquito", title:"Holix loquix!"});
});


server.listen(3000, function(){
	console.log("Listen on port 3000\n");
});

app.put('/', function(req, res) {
	var postcode = (req.body.nombre).replace(" ","+");
	res.contentType('json');
	res.send(JSON.stringify({status:"success"}));
	result = getQuery(postCode);
  	res.render('index',{layout:false, message:result, title:"Holix loquix!"});
});

var enviar = function(a,b){b.emit('news', {a});console.log("hola : " + JSON.stringify(a));}

var prepararYEnviar= function(socket,propiedades){
  return function(propiedades){
    for (var i = propiedades.length - 1; i >= 0; i--) {
      enviar(JSON.stringify(propiedades[i]),socket);
    }
  }
}

var handleClient = function(socket){

  var postCodeF = function(postCode){
    zooplaHandler.getResults(postCode.replace(" ","+"),prepararYEnviar(socket));
    rightmoveHandler.getResults(postCode.replace(" ","+"),prepararYEnviar(socket));
  }
  socket.on('postCode', postCodeF);

}
io.sockets.on('connection', handleClient);

