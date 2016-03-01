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
  var enviar = function(data){socket.emit('news', {data});console.log(data);}

  var queryA = function(data){
    controller.getResultsQueryA(data.postcode,data.radius, data.days, data.queryname , enviar);
    setTimeout(function () {
            enviar("");
    }, 500);

  }

  var queryB = function(postcode){
    controller.getResultsQueryB(postcode,enviar);
    enviar("recibi una query B");
    console.log('queryB recibida')
  }

  socket.on('queryA', queryA);
  socket.on('queryB', queryB);

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
