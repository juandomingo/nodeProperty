module.exports = function() {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./db/property.db');
	var fs = require('fs');
	var Postcode = require('./../model/Postcode.js');
	var Propertytype = require('./../model/Propertytype.js');
	var EstateAgent = require('./../model/EstateAgent.js');

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
	var db = new sqlite3.Database('./db/property.db');
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
	var db = new sqlite3.Database('./db/property.db');
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
			var db = new sqlite3.Database('./db/property.db');
			var sql = "INSERT INTO `postcode` (`id`,`name`) VALUES (?,?);"
			var params = [null,name];
			var stmt = db.prepare(sql);
			stmt.run(params,function(){stmt.finalize();db.close();callback(new Postcode(this.lastID,name))});
		}
	});
}

var getTypeCodeFromType = function(type,callback){
	var db = new sqlite3.Database('./db/property.db');
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
			var db = new sqlite3.Database('./db/property.db');
			var sql = "INSERT INTO `propertytype` (`id`,`type`) VALUES (?,?);"
			var params = [null,type];var stmt = db.prepare(sql);
			stmt.run(params,function(){stmt.finalize();db.close();callback(new Propertytype(this.lastID,type))});
		}
	});
}


var getEstateStudioFromName = function(name,callback){
	var db = new sqlite3.Database('./db/property.db');
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


			var db = new sqlite3.Database('./db/property.db');
			var sql = "INSERT INTO `stateagent` (`id`,`name`,'postcode_id') VALUES (?,?,?);"
			insertOrGetPostCode(postcodeName,function(result){
				var params = [null,name,result.id];var stmt = db.prepare(sql);
				stmt.run(params,function(){stmt.finalize();db.close();callback(new EstateAgent(this.lastID,name,result))});
			});
		}
	});
}

var asociateWithQuery = function(queryID,propID, callback){

	var db = new sqlite3.Database('./db/property.db');
	var sql = "INSERT INTO `propInQuery` (`id`,`queryid`,`propid`) VALUES (?,?,?);"
	var params = [null,queryID,propID];
	var stmt = db.prepare(sql);
	db.configure("busyTimeout", 2000);
	stmt.run(params,function(){
		stmt.finalize();
		db.close();
		callback();
	});

}

var asociateWithPage = function(propID,pageID){
								
	var db = new sqlite3.Database('./db/property.db');
	var sql = "INSERT INTO `propInPage` (`id`,`pageid`,`propid`) VALUES (?,?,?);"
	var params = [null,pageID,propID];
	var stmt = db.prepare(sql);
	db.configure("busyTimeout", 2000);
	stmt.run(params,function(){
		stmt.finalize();
		db.close();
	});

}



var saveProperty = function(queryID,property,extra) {
		insertOrGetPostCode(property.postcode, function(result){
			var postcode = result;
			insertOrGetType(property.type, function(result){
				
				var typeID = result;
				insertOrGetEstateStudio(property.stateagent, extra.stateP, function(result){
					var webSitePropertyID = extra.webSitePropertyID;
					var webSiteID = extra.webSiteID;
					var db = new sqlite3.Database('./db/property.db');
					db.configure("busyTimeout", 6000);
					var stateAgent = result;
					var sql = "INSERT INTO `property` (`id`,`type_id`, `number_beedrooms`, `postcode_id`,`state_agent_id`,`price`,`date_listing`) "+  
					"VALUES (?,?, ?, ?, ?, ?,?);";
					var params = [null,typeID.id, property.nobedrooms, postcode.id, stateAgent.id, property.price, property.datelisting];
					var stmt = db.prepare(sql);

					stmt.run(params,function(err){

						propID = this.lastID;
						stmt.finalize();
						db.close();
   						asociateWithQuery(queryID,propID,function(){
							asociateWithPage(webSitePropertyID, webSiteID);
						});
					});
				});
			});
		});
};


getPropertiesIn = function(postcode, callback){
	var db = new sqlite3.Database('./db/property.db')
	var stateAgent = result;
	var sql = "SELECT * from `property` where `postcode_id` = ?;"
	var stmt = db.prepare(sql);
	getPostCodeFromName(postcode,function(postcode){

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
	var db = new sqlite3.Database('./db/property.db');
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




  var db = {
      "getResults" : function(postCode,callback){_callback = callback; _postcode=postCode; getPostCode(postCode)},
  	  "createDB" : function(){createDB()},
  	  "rawSQL" : function(sql,callback){rawSQL(sql,callback);},
  	  "saveProperty" : function(queryID,property,extra,callback){_callback = callback;saveProperty(queryID,property,extra);},
  	  "saveQuery" : function(postcode, radius, days, queryName,callback){saveQuery(postcode, radius, days, queryName, callback);}
  }

  return db;
}();

