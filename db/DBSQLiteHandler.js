module.exports = function() {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./db/property.db');
	var fs = require('fs');
	var Postcode = require('./../model/Postcode.js');
	var Propertytype = require('./../model/Propertytype.js');
	var EstateAgent = require('./../model/EstateAgent.js');
	var Property = require('./../model/Property.js');

var readFromFile = function(filename,callback){
	fs.readFile(filename, "utf-8", function read(err, sql) {
		if (err) {
			onError(err);
			return;
		}
		callback(sql);
	});
}

var rawSQL = function(sql,callback){
	var db = new sqlite3.Database('./db/property.db');
	db.get(sql,callback);
	db.close();
}

var createDB = function(){
	var filename = './db/property.sql';
	readFromFile(filename,function(sql){
		sqles = sql.match(/(CREATE)[\w\s\`\(\,\)]+\;/g);
		var db = new sqlite3.Database('./db/property.db');
		for (var i = sqles.length - 1; i >= 0; i--) {
			db.run(sqles[i]);
		}		
		db.close();
	});

}

var getPostCodeFromID = function(id,callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY);
	var sql = "select * from `postcode` where `id` = ?;"
	var params = [id];
	var stmt = db.prepare(sql);

	stmt.get(params,function(err, row) {

		if (row !== undefined){
			result = new Postcode(row['id'],row['name']);
		}
		else{
			result = null;
		}
		stmt.finalize();
		db.close();
		callback(result);
	});
}

var getPostCodeFromName = function(name,callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY);
	var sql = "select * from `postcode` where `name` = ?;"
	var params = [name];
	var stmt = db.prepare(sql);
	var result;
	stmt.get(params,function(err, row) {
		if (row !== undefined){
			result = new Postcode(row['id'],row['name']);
		}
		else{
			result = null;
		}
		stmt.finalize();
		db.close();
		callback(result);
	});
}

var insertOrGetPostCode = function(name,callback){
	getPostCodeFromName(name, function(result){
		if (result !== null)
			{callback(result);}
		else
		{
			var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
			var sql = "INSERT INTO `postcode` (`id`,`name`) VALUES (?,?);"
			var params = [null,name];
			var stmt = db.prepare(sql);
			stmt.run(params,function(){stmt.finalize();db.close();callback(new Postcode(this.lastID,name))});
		}
	});
}

var getTypeCodeFromType = function(type,callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY);
	var sql = "select * from `propertytype` where `type` = ?;"
	var params = [type];var stmt = db.prepare(sql);
	stmt.get(params,function(err, row) {
		if (row !== undefined){
			result = new Propertytype(row['id'],row['type']);
		}
		else{
			result = null;
		}
		stmt.finalize();
		db.close();
		callback(result);
	});
}

var insertOrGetType = function(type,callback){
	getTypeCodeFromType(type, function(result){
		if (result !== null)
			{callback(result);}
		else
		{
			var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
			var sql = "INSERT INTO `propertytype` (`id`,`type`) VALUES (?,?);"
			var params = [null,type];var stmt = db.prepare(sql);
			stmt.run(params,function(){stmt.finalize();db.close();callback(new Propertytype(this.lastID,type))});
		}
	});
}


var getEstateStudioFromName = function(name,callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY);
	var sql = "select * from `stateagent` where `name` = ?;"
	var params = [name];
	var stmt = db.prepare(sql);

	stmt.get(params,function(err, row) {
		if (row !== undefined){
			stmt.finalize();db.close();
			getPostCodeFromID(row['postcode_id'],function(result){
				callback(new EstateAgent(row['id'],row['name'],result));
			})
		}
		else{
			stmt.finalize();db.close();callback(null);
		}
	});
}

var insertOrGetEstateStudio = function(name,postcodeName,callback){
	getEstateStudioFromName(name, function(result){
		if (result !== null)
			{callback(result);}
		else
		{
			insertOrGetPostCode(postcodeName,function(result){
				var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
				var sql = "INSERT INTO `stateagent` (`id`,`name`,'postcode_id') VALUES (?,?,?);"
				var params = [null,name,result.id];var stmt = db.prepare(sql);
				stmt.run(params,function(){stmt.finalize();db.close();callback(new EstateAgent(this.lastID,name,result))});
			});
		}
	});
}

var  asociateWithQuery = function(queryID,propID, callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
	var sql = "INSERT INTO `propInQuery` (`id`,`queryid`,`propid`) VALUES (?,?,?);"
	var stmt = db.prepare(sql);
	//var params = [null,queryID,propID];
	stmt.get([null,queryID,propID],function(err){
		if (err !== null)
			{console.log(err);}
		stmt.finalize();
		db.close();
		callback();
	});

}

var  asociateWithPage = function(propID,pageID,callback){						
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
	var sql = "INSERT INTO `propInPage` (`id`,`pageid`,`propid`) VALUES (?,?,?);"
	var stmt = db.prepare(sql);
	//var params = [null,pageID,propID];

	stmt.get([null,pageID,propID],function(err){
		if (err !== null)
			{console.log(err);}
		stmt.finalize();
		db.close();
		
		callback();
	});


}

 saveFullProp = function(prop,callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
	var sql = "INSERT INTO `property` (`id`,`type_id`, `number_beedrooms`, `postcode_id`,`state_agent_id`,`price`,`date_listing`) "+  
	"VALUES (?,?, ?, ?, ?, ?,?);";
	var stmt = db.prepare(sql);
	var params = [null,prop.type.id, prop.nobedrooms, prop.postcode.id, prop.stateagent.id, prop.price, prop.datelisting];
	stmt.run(params,function(){
		prop.id = this.lastID;
		stmt.finalize();
		db.close();
		callback(prop);
	});
}

var getPropertyFromQuery = function(queryID,property,extra,callback) {

		insertOrGetPostCode(property.postcode, function(result){
			var postcode = result;
			insertOrGetType(property.type, function(result){
				var type = result;
				insertOrGetEstateStudio(property.stateagent, extra.stateP, function(result){
					var stateAgent = result;
					callback(new Property(null,type,property.nobedrooms,postcode,stateAgent,property.price, property.datelisting
						));
				});
			});
		});
	};



var getPropertiesIn = function(postcode, callback){
	getPostCodeFromName(postcode,function(postcode){
		var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY)
		var stateAgent = result;
		var sql = "SELECT * from `property` where `postcode_id` = ?;"
		var stmt = db.prepare(sql);
		var params = [postcode.id];
		stmt.each(params,function(err, row){
			callback(row)
			stmt.finalize();
			db.close();
		});
	})
}

var saveQuery = function(postcode, radius, days, queryName,callback){
	var id;
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READWRITE);
	var sql = "INSERT INTO `query` (`id`,`name`,`postcode`,`days`,`radius`) VALUES (?,?,?,?,?);"
	var params = [null,queryName,postcode,days,radius];
	var stmt = db.prepare(sql);
	stmt.run(params,function(){
		id = this.lastID;
		stmt.finalize();
		db.close();
		callback(id);
	});
}

var getQueries = function(callback){

		var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY)
		var sql = "SELECT * from `query`;"
		var stmt = db.prepare(sql);
		stmt.each([],function(err, row){
			callback(row)
		});
		stmt.finalize();
		db.close();
		
}

var getTypes = function(callback){
		var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY)
		var sql = "SELECT * from `propertytype`;"
		var stmt = db.prepare(sql);
		stmt.each([],function(err, row){
			callback(row)
		});
		stmt.finalize();
		db.close();
}

var getPropertyInQuery = function(queryID,callback){
	var db = new sqlite3.Database('./db/property.db',sqlite3.OPEN_READONLY)
	var sql = "SELECT P.id as id,"+
"P.id as id, " +	
"P.type_id as typeid, " +
"P.number_beedrooms as numberbeedrooms, " +
"P.postcode_id as postcodeid, " +
"P.state_agent_id as stateagentID, " +
"P.price as price, " +
"P.date_listing as datelisting,  " +
"PC.name as postcodename,  " +
"PT.type as typetype,  " +
"SA.name as stateagentname,  " +
"PCSA.id as stateagentpostcodeid, " +
"PCSA.name as stateagentpostcode " +
"from `property` as P " +
"INNER JOIN `propInQuery` as PIQ ON P.id = PIQ.`propid`  " +
"INNER JOIN `propertytype` as PT ON P.type_id = PT.`id` " +
"INNER JOIN `stateagent` as SA ON P.state_agent_id = SA.`id` " +
"INNER JOIN `postcode` as PC ON P.postcode_id = PC.`id` " +
"INNER JOIN `postcode` as PCSA ON SA.postcode_id = PCSA.`id` " +
"WHERE PIQ.`queryid` = ? ;"
	var stmt = db.prepare(sql);
	stmt.each([queryID],function(err, row){


		callback(new Property(row.id,new Propertytype(row.typeid,row.typetype),row.numberbeedrooms,
			new Postcode(row.postcodeid, row.postcodename),
			new EstateAgent(row.stateagentID,row.stateagentname,
				new Postcode(row.stateagentpostcodeid, row.stateagentpostcode)),
			row.price,
			row.datelisting));
	});
	stmt.finalize();
	db.close();
}


  var db = {
	  	"getResults" : function(postCode,callback){_callback = callback; _postcode=postCode; getPostCode(postCode)},
	  	"createDB" : function(){createDB()},
	  	"rawSQL" : function(sql,callback){rawSQL(sql,callback);},
	  	"getPropertyFromQuery" : function(queryID,property,extra,callback){getPropertyFromQuery(queryID,property,extra,callback);},
	  	"saveQuery" : function(postcode, radius, days, queryName,callback){saveQuery(postcode, radius, days, queryName, callback);},
		"saveFullProp" : function(property,callback){saveFullProp(property,callback);},
		"asociateWithPage" : function(propID,pageID,callback){asociateWithPage(propID,pageID,callback);},
		"asociateWithQuery" : function(queryID,propID,callback){asociateWithQuery(queryID,propID, callback);},
  		"getQueries" : function(callback){getQueries(callback);},
  		"getTypes" : function(callback){getTypes(callback);},
  		"getPropertyInQuery" : function(queryID,callback){getPropertyInQuery(queryID,callback);}
  }

  return db;
}();
