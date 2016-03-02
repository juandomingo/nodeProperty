module.exports = function() {
	var propertyGetter = require('./handler/propertyGetter.js');
	var dbHandler = require('./db/DBSQLiteHandler.js');
	var Property  = require('./model/Property.js');
	var Jetty = require("jetty");
	var jetty = new Jetty(process.stdout)
;	dbHandler.createDB();
	var getQueryA = function(postcode, radius, days, queryName, callbackP){
		var queryID = null;
		var properties = [];

		var callback0 = function (props){
			console.log("Saving metadata, Total " + props.length);
			var done = 0;
			var recursive = function (id){
				prop = props[id];
				dbHandler.asociateWithPage(prop.webSitePropertyID,prop.webSiteID,function(){
					done++;
					if (done == props.length)
						{callback(props);}
					else{
						console.log(id);
						recursive(done);

					}
				});
			}
			recursive(done);
		}

		var callback = function (props){	
			console.log("Saving Properties, Total " + props.length);
			var done = 0;
			var recursive = function (id){
				prop = props[id];

				var property = new Property(null,prop.type, prop.bedroomno, prop.postcode, prop.agentname, prop.firstprice, prop.lastdate);
				dbHandler.getPropertyFromQuery(queryID,property,{'stateP' : prop.agentpostCode, 'webSitePropertyID' : prop.webSitePropertyID, 'webSiteID' : prop.webSiteID},function(fullProp){
					dbHandler.saveFullProp(fullProp,function(fullPropWithId){
						properties.push(fullPropWithId);
						done++;
						if (done == props.length)
							{callback2(properties);}
						else{
							console.log(id);
							recursive(done);
						}
					});
				});
			};
			recursive(done);
		};

		var callback2 = function(fullProps){
			console.log("Saving metadata, again Total " + fullProps.length);
			var done = 0;
			var recursive = function (id){
				fullPropWithId = fullProps[id];
				dbHandler.asociateWithQuery(queryID,fullPropWithId.id,function(){
					done++;
					if (done == fullProps.length)
						{console.log("FIN");}
					else{
						console.log(id);
						recursive(done);
					}
					
				});
			}
			recursive(done);
		};

		dbHandler.saveQuery(postcode, radius, days, queryName,function(result){
			queryID = result;
			propertyGetter.getPropInPostCode(postcode, radius, days,callback0);
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
