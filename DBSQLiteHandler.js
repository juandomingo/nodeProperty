module.exports = function() {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./property.db');
	var fs = require('fs');

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


saveProperty = function(property) {
	var db = new sqlite3.Database('./db/property.db');
	var postcodeID = 1;
	var typeID = 1;
	var stateAgentID = 1;

	var sql = "INSERT INTO `property` (`id`,`type_id`, `number_beedrooms`, `postcode_id`,`state_agent_id`,`price`,`date_listing`) "+  
	"VALUES (?,?, ?, ?, ?, ?,?);";
	var params = [null,typeID, property.nobedrooms, postcodeID, stateAgentID, property.price, property.datelisting];

	var stmt = db.prepare(sql);
	stmt.run(params);
	stmt.finalize();
	db.close();
};




  var db = {
  	  "testDB" : function(){test();},
      "getResults" : function(postCode,callback){_callback = callback; _postcode=postCode; getPostCode(postCode)},
  	  "createDB" : function(){createDB()},
  	  "rawSQL" : function(sql,callback){rawSQL(sql,callback);},
  	  "saveProperty" : function(property){saveProperty(property);}
  }

  return db;
}();

