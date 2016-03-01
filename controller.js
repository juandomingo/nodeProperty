module.exports = function() {
	var propertyGetter = require('./handler/propertyGetter.js');
	var dbHandler = require('./db/DBSQLiteHandler.js');
	var Property  = require('./model/Property.js');
	dbHandler.createDB();
	var getQueryA = function(postcode, radius, days, queryName, callbackP){
		var queryID = null;
		var properties = [];
		var callback = function (prop){
			var property = new Property(null,prop.type, prop.bedroomno, prop.postcode, prop.agentname, prop.firstprice, prop.lastdate);
			dbHandler.getPropertyFromQuery(queryID,property,{'stateP' : prop.agentpostCode, 'webSitePropertyID' : prop.webSitePropertyID, 'webSiteID' : prop.webSiteID},function(fullProp){
				dbHandler.saveFullProp(fullProp,function(fullPropWithId){
					setTimeout(function(){
						properties.push(fullPropWithId);
						dbHandler.asociateWithPage(prop.webSitePropertyID,prop.webSiteID,function(){
							dbHandler.asociateWithQuery(queryID,fullPropWithId.id,function(){});
						});
					}, 3000);
				});
			});
		};
		dbHandler.saveQuery(postcode, radius, days, queryName,function(result){
			queryID = result;
			propertyGetter.getPropInPostCode(postcode, radius, days,callback);
		});
		
	}

	var getQueryB = function(queryID,callback){
    	dbHandler.getPropertyInQuery(queryID,callback);
	}

	var getQueries = function(callbackP){
		dbHandler.getQueries(callbackP);
	}

	var getTypes = function(callbackP){
		dbHandler.getTypes(callbackP);
	}


  	var controller = {
      "getResultsQueryA" : function(postcode, radius, days,queryname, callback){getQueryA(postcode, radius, days, queryname, callback)},
      "getResultsQueryB" : function(queryID,callback){getQueryB(queryID,callback);},
      "getQueries" : function(callback){getQueries(callback);},
      "getTypes" : function(callback){getTypes(callback);}
  	}

  	return controller;

}();
