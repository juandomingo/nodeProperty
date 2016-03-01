module.exports = function() {
	var zooplaHandler = require('./zooplaHandler.js');
	var rightmoveHandler = require('./rightmoveHandler.js');

  var propertyGetter = {
      
      "getPropInPostCode" : function(postcode, radius, days,callback){
      	//add more handlears whenever you need.
      	zooplaHandler.getResults(postcode.replace(" ","+"),radius, days, callback);
              
    		//rightmoveHandler.getResults(postcode.replace(" ","+"),radius, days, callback);
      	}
  }

  return propertyGetter;
}();

