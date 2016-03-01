var compareDates = function(propertyDate, queryDays,callback){
  	propDate = Date.parse(propertyDate);
  	today = Date.now();

  	var days = 1000 * 60 * 60 * 24;

	callback((today-propDate)/days <= queryDays);
}


var callback = console.log;

new Date();

compareDates("2016-02-25","7",callback);


 