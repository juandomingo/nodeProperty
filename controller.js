//var rightmoveHandler = require('./rightmoveHandler.js');
//rightmoveHandler.getResults("E15+1DD",console.log);
//var dbHandler = require('./DBSQLiteHandler.js');
//dbHandler.createDB();
//dbHandler.testDB();
//dbHandler.rawSQL("select * from sqlite_master",console.log);
module.exports = function() {
	
	var propertyGetter = require('./handler/propertyGetter.js');
	var dbHandler = require('./db/DBSQLiteHandler.js');
	var Property  = require('./model/Property.js');
	dbHandler.createDB();
	//dbHandler.rawSQL( "PRAGMA journal_mode = TRUNCATE;")
	var getQueryA = function(postcode, radius, days, queryName, callbackP){
		var queryID = null;

		callback = function (prop){
			var property = new Property(prop.type, prop.bedroomno, prop.postcode, prop.agentname, prop.firstprice, prop.lastdate);
			dbHandler.saveProperty(queryID,property,{'stateP' : prop.agentpostCode, 'webSitePropertyID' : prop.webSitePropertyID, 'webSiteID' : prop.webSiteID},callbackP);
		}

		dbHandler.saveQuery(postcode, radius, days, queryName,function(result){
			queryID = result;
			propertyGetter.getPropInPostCode(postcode, radius, days,callback);
		});

	}

	var getQueryB = function(postCode, callbackP){

	}

  	var controller = {
      "getResultsQueryA" : function(postcode, radius, days,queryname, callback){getQueryA(postcode, radius, days, queryname, callback)},
      "getResultsQueryB" : function(){}
  	}

  	return controller;

}();

