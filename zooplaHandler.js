module.exports = function() {
  var http = require('http');
  var api_key = "j6c2abyzvka7jnspwbzs6kpe";
  var options = {
    host: "api.zoopla.co.uk", 
    port: 80,
    path: '/result?key=5memkqdpsgr4om0t&q=lebovic&l-availability=y%2Ff&encoding=json&zone=picture&s=0',
    method: 'GET'
  };

  function getQuery(postcode,callback){
  	//eg : E15+1DD
  	link = "/api/v1/property_listings.json?postcode=" + postcode + "&api_key="+ api_key;
  	options.path = link;
  	result = "";
  	http.request(options, function(res) {

    		console.log('STATUS: ' + res.statusCode);
    		res.setEncoding('utf8');
    		
    		res.on('data', function (chunk) {
  			 result += chunk; 
  	  	});

        res.on('end',function(){
            callback(getProperty(result));
        });
  	}).end( );
  }


  getProperty = function(json){

    properties = eval("["+ json +"]")[0]['listing'];
    asd = eval("["+ json +"]")[0]['listing'];
    listProp = [];
    for (var i = properties.length - 1; i >= 0; i--) {
      listProp.push( {type:(asd)[i]['property_type'].toLowerCase(),bedroomno:(asd)[i]['num_bedrooms'],firstprice: (asd)[i]['price'],firstdate : (asd)[i]['first_published_date'], lastdate : (asd)[i]['last_published_date'],postcode : eval("["+ json +"]")[0]['postcode'], agentname :(asd)[i]['agent_name'], "agentpostCode":"?"} );
    }

    return listProp;

  }

  var zoopla = {
      "getResults" : function(postCode,callback){getQuery(postCode,callback)}
  }

  return zoopla;
}();

