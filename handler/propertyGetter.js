module.exports = function() {
	var zooplaHandler = require('./zooplaHandler.js');
	var rightmoveHandler = require('./rightmoveHandler.js');

  var propertyGetter = {
      "getPropInPostCode" : function(postCode,callback){
      		//add more handlears whenever you need.
      		zooplaHandler.getResults(postCode.replace(" ","+"),callback);
    		rightmoveHandler.getResults(postCode.replace(" ","+"),callback);
    	}
  }

  return propertyGetter;
}();

