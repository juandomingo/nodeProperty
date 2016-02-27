module.exports = function() {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./db/property.db');
	var fs = require('fs');
	var Postcode = require('./../model/Postcode.js');
	var Propertytype = require('./../model/Propertytype.js');
	var EstateAgent = require('./../model/EstateAgent.js');

readFromFile = function(filename,callback){
	fs.readFile(filename, "utf-8", function read(err, sql) {
    	if (err) {
      		onError(err);
      		return;
	    }
	    callback(sql);
	});
}

rawSQL = function(sql,callback){
	var db = new sqlite3.Database('./db/property.db');
	db.get(sql,callback);
	db.close();
}

createDB = function(){
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


test = function(){

	db.serialize(function() {
  	db.run("CREATE TABLE lorem (info TEXT)");

  	var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  	for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  	}
  	stmt.finalize();

  	db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  	});
	});

	db.close();
}

getPostCodeFromID = function(id,callback){
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

getPostCodeFromName = function(name,callback){
	var db = new sqlite3.Database('./db/property.db');
	var sql = "select * from `postcode` where `name` = ?;"
	var params = [name];
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

insertOrGetPostCode = function(name,callback){
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

getTypeCodeFromType = function(type,callback){
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

insertOrGetType = function(type,callback){
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


getEstateStudioFromName = function(name,callback){
	var db = new sqlite3.Database('./db/property.db');
	var sql = "select * from `stateagent` where `name` = ?;"
	var params = [name];var stmt = db.prepare(sql);
	stmt.get(params,function(err, row) {
		if (row !== undefined){
			getPostCodeFromID(row['postcode_id'],function(result){
				stmt.finalize();db.close();
				callback(new EstateAgent(row['id'],row['name'],result));
			})
		}
		else{
			stmt.finalize();db.close();callback(null);
		}
	});
}

insertOrGetEstateStudio = function(name,postcodeName,callback){
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


saveProperty = function(property,extra) {
	

		insertOrGetPostCode(property.postcode, function(result){
			var postcode = result;
			insertOrGetType(property.type, function(result){
				var typeID = result;
				console.log(extra);
				insertOrGetEstateStudio(property.stateagent, extra.stateP, function(result){
					var db = new sqlite3.Database('./db/property.db')
					var stateAgent = result;
					var sql = "INSERT INTO `property` (`id`,`type_id`, `number_beedrooms`, `postcode_id`,`state_agent_id`,`price`,`date_listing`) "+  
					"VALUES (?,?, ?, ?, ?, ?,?);";
					var params = [null,typeID.id, property.nobedrooms, postcode.id, stateAgent.id, property.price, property.datelisting];

					var stmt = db.prepare(sql);
					stmt.run(params);
					stmt.finalize();
					db.close();
				});
			});
		});
};




  var db = {
  	  "testDB" : function(){test();},
      "getResults" : function(postCode,callback){_callback = callback; _postcode=postCode; getPostCode(postCode)},
  	  "createDB" : function(){createDB()},
  	  "rawSQL" : function(sql,callback){rawSQL(sql,callback);},
  	  "saveProperty" : function(property,extra){saveProperty(property,extra);}
  }

  return db;
}();

