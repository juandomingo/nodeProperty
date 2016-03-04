module.exports = function() {
	var zooplaHandler = require('./zooplaHandler.js');
	var rightmoveHandler = require('./rightmoveHandler.js');

  var propertyGetter = {
      
      "getPropInPostCode" : function(postcode, radius, days,callback){
      	//add more handlears whenever you need.
        var properties = [];
        var handlers = 2;
        var doneV = 0;
        var collect = function(data){
            properties.push(data);
        }
        var done = function(){
          doneV++;
          if (doneV === handlers)
          {
            callback(properties);
          }
        }
      	zooplaHandler.getResults(postcode.replace(" ","+"),radius, days, collect, done);
    		rightmoveHandler.getResults(postcode.replace(" ","+"),radius, days, collect, done);
      	}
  }

  return propertyGetter;
}();

