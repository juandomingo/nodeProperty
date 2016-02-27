/*
WE ARE NOT GOING TO USE THIS FOR NOW BECAUSE WE WOULD NEED A SERVER TO DO SO.
*/


module.exports = function() {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'user',
	  password : 'user',
	  database : 'property.db'
	});


test = function(){
	connection.connect();

	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  	if (err) throw err;

  	console.log('The solution is: ', rows[0].solution);
	});

	connection.end();
}






  var db = {
  	  "testDB" : function(){test();},
      "getResults" : function(postCode,callback){_callback = callback; _postcode=postCode; getPostCode(postCode)}
  }

  return db;
}();

