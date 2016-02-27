//var rightmoveHandler = require('./rightmoveHandler.js');
//rightmoveHandler.getResults("E15+1DD",console.log);
//var dbHandler = require('./DBSQLiteHandler.js');
//dbHandler.createDB();
//dbHandler.testDB();
//dbHandler.rawSQL("select * from sqlite_master",console.log);
var propertyGetter = require('./handler/propertyGetter.js');
var dbHandler = require('./db/DBSQLiteHandler.js');
var Property  = require('./model/Property.js');


callback = function (prop){
          //_callback ([{type:type,bedroomno:nobed,firstprice: price ,firstdate : date, lastdate : date,postcode : postcode, agentname :agentN, agentpostCode :agentP }]);

	property = new Property(prop.type, prop.bedroomno, prop.postcode, prop.agentname, prop.firstprice, prop.lastdate);

	dbHandler.saveProperty(property,{'stateP' : prop.agentpostCode});
}
propertyGetter.getPropInPostCode("E15 1DD",callback);