module.exports = function() {
	var http = require('http');
	var _api_key = "j6c2abyzvka7jnspwbzs6kpe";
	var _callback;
	var _postcode;
	var _days;
	var _radius;
	var _webSiteID = 1; 

  	var _daysMilisec = 1000 * 60 * 60 * 24;

	var options = {
		host: "api.zoopla.co.uk", 
		port: 80,
		path: '',
		method: 'GET'
	};

	var getQuery = function(callback){
		//eg : E15+1DD
		link = "/api/v1/property_listings.json?postcode=" + _postcode + "&api_key="+ _api_key +"&radius=" +_radius ;
		options.path = link;
		result = "";
		http.request(options, function(res) {

			console.log('STATUS: ' + res.statusCode);
			res.setEncoding('utf8');
			
			res.on('data', function (chunk) {
				result += chunk; 
			});

			res.on('end',function(){
				var proplist = getProperty(result)
				for (var i = proplist.length - 1; i >= 0; i--) {
			  		callback(proplist[i]);
				}

			});
		}).end( );
  	}


  	var getProperty = function(json){

		properties = eval("["+ json +"]")[0]['listing'];
		asd = eval("["+ json +"]")[0]['listing'];
		listProp = [];
		if (properties !== undefined){
	  		for (var i = properties.length - 1; i >= 0; i--) {
	  			var lastDate =  formatDate((asd)[i]['last_published_date']);
	  			if (inDaysRange(lastDate,_days,_callback)){
 					listProp.push( {type:(asd)[i]['property_type'].toLowerCase(),bedroomno:(asd)[i]['num_bedrooms'],firstprice: (asd)[i]['price'],firstdate : (asd)[i]['first_published_date'], lastdate : lastDate,postcode : eval("["+ json +"]")[0]['postcode'], agentname :(asd)[i]['agent_name'], "agentpostCode":"?", "webSiteID" : _webSiteID, 'webSitePropertyID' : (asd)[i]['listing_id']} );
	  			}
	  		}		
		}
		return listProp;
  	}

var inDaysRange = function(propertyDate, rangeDays,callback){
  	var propDate = Date.parse(propertyDate);
  	var today = Date.now();

	return ((today-propDate)/_daysMilisec <= rangeDays);
}

var formatDate = function(date){
	return date.substring(0,10);

}

  	var zoopla = {
	  	"getResults" : function(postcode,radius,days,callback){_callback = callback; _postcode=postcode; _radius= radius; _days = days;getQuery(callback)}
  	}

  	return zoopla;
}();

