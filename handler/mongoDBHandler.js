module.exports = function() {

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/property';


	var getAllRMrawDataF = function(db, callback){
		var cursor =db.collection('property').find();
   		cursor.each(function(err, doc) {

	      	assert.equal(err, null);
	      	if (doc !== null) {
	        	callback(doc);
	      	} else {
	        	db.close();
	      	}

   		});

	};
	var getAllRMrawData = function(callback){
		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		getAllRMrawDataF(db, function(doc) {
				db.close();
	      		callback(doc);
	  		});
		});
	};


	var insertRMrawDataF = function(data, db, callback) {
   		db.collection('property').insertOne( data, function(err, result) {
		    assert.equal(err, null);
		    //console.log("Inserted a document into the restaurants collection.");
		    callback(true);
  		});
	};
	var saveRMrawData = function(data,callback){
		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		insertRMrawDataF(data,db, function(result) {
	      		db.close();
	      		callback(result);
	  		});
		});
	};

	var mongodbhandler = {
      "getAllRMrawData" : function(callback){getAllShoes(callback)},
      "saveRMrawData" : function(data, callback){insertShoe(data, callback)}
  	}

  	return mongodbhandler;
		

}();
