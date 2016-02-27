module.exports = function() {
  var http = require('http');
  var _callback;
  var _postcode;
  var fs = require('fs');
  var options = {

    host: "www.rightmove.co.uk", 
    port: 80,
    path: '',
    method: 'GET'
  };

 getPropertyValues = function(link){
    options.path = link;
    var result = "";
    http.request(options, function(res) {


        res.setEncoding('utf8');
        
        res.on('data', function (chunk) {
         result += chunk; 
        });

        res.on('end',function(){
          (parseProperty(result));
        });
    }).end( );


 }

  function getQuery(newPostCode){
    var link = "/property-for-sale/find.html?searchType=SALE&locationIdentifier="+ newPostCode +"&insId=2&radius=0.0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=&displayPropertyType=&maxDaysSinceAdded=&_includeSSTC=on&sortByPriceDescending=&primaryDisplayPropertyType=&secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&newHome=&auction=false";
    options.path = link;
  	var result = "";
  	http.request(options, function(res) {


    		res.setEncoding('utf8');
    		
    		res.on('data', function (chunk) {
  			 result += chunk; 
  	  	});

        res.on('end',function(){
          var links = parsePropertiesLink(result, newPostCode);
            for (var i = links.length - 1; i >= 0; i--) {
              getPropertyValues(links[i]);
            }
        });
  	}).end( );
  }

  getPostCode = function(postcode){
    var linkForPostCode = "/property-for-sale/search.html?searchLocation=" + postcode + "&locationIdentifier=&useLocationIdentifier=false&buy=For+sale";
    options.path = linkForPostCode;
    var result = "";
    http.request(options, function(res) {
        res.setEncoding('utf8');
        
        res.on('data', function (chunk) {
         result += chunk; 
        });

        res.on('end',function(){
            getQuery(parsePostCode(result));
        });
    }).end();
  }

    parseProperty = function(html){
          result =[]
          type = html.match(/(\"BD\"\:\[\")\w*(\"\])/)[0].split("[")[1];
          type = type.replace(/\"/g,"");
          type = type.replace(/\]/,"");


          nobed = "0";
          postcode = _postcode.replace("+", " ");

          agent = html.match(/(ontactagent-footer)[\s\S]{1,5000}(\<\/address)/)[0];
          agentN = agent.match(/(\>).+(\<\/s)/)[0];
          agentN = agentN.match(/([\w\,\s]+)/g)[1];

          agentP = agent.match(/\w{3}\s\w{3}/g);
          agentP = agentP[agentP.length -1];

          price = html.match(/(\"listing\_totalvalue\"\:)\d+/)[0];
          price = price.match(/\d+/)[0];

          date = html.match(/(firstListedDateValue\"\>)[\w\s]+/)[0];
          date = date.match(/\d{1,2}\s[\w]+\s\d{4}/)[0];
          date = dateToYYYYMMDD(date);

          _callback ({type:type,bedroomno:nobed,firstprice: price ,firstdate : date, lastdate : date,postcode : postcode, agentname :agentN, agentpostCode :agentP });
      

  /*        
Type of property (Detached, terraced, flat/apartment etc)  "BD":["studio"]
No. Bedrooms 0
Postcode (this is accessible via source code) el dado
Estate Agent (Name and postcode)  <strong>Chase Evans, Canary Wharf</strong></a></p>
            <address class="pad-0">Horizon Building,
15 Hertsmere Road,
London,
E14 4AW

Price  precio "listing_totalvalue":295000.0 

Date of listing  <div id="firstListedDateValue">29 January 2016</div>
*/



    }


    parsePostCode = function(html){
        return (/(POSTCODE)\^\d*/).exec(html)[0];
    }

    parsePropertiesLink = function(html){
        links = [];

        crappylinks = (html.match(/\/new-homes-for-sale\/property-\d+.html/g));
        if (crappylinks === null)
          {
            fs.appendFile("./error.html", html  , function(err) {
              if(err) {
                return console.log(err);
              }
            });
            return [];
          }
        for (var i = 0; i < crappylinks.length; i++) {
            pushIfNew(crappylinks[i],links)
        }
        return links;
    }

    function pushIfNew(obj,array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) { // modify whatever property you need
          return;
        }
      }
      array.push(obj);
    }


    var dateToYYYYMMDD = function (date){
        var day = date.match(/\d{1,2}/)[0];
        if (day.length == 1 ) {day = "0" + day;} 
        var year = date.match(/\d{4}/)[0];
        var month = date.match(/[^\d\s]+/)[0];
        month = month.toLowerCase(); 
        var months = {
            'january' : '01',
            'february' : '02',
            'march' : '03',
            'april' : '04',
            'may' : '05',
            'june' : '06',
            'july' : '07',
            'august' : '08',
            'september' : '09',
            'october' : '10',
            'november' : '11',
            'december' : '12'
        }
    return ""+ year + "-" + months[month] +"-" + day + " 00:24:52";


    }   

  var rightmove = {
      "getResults" : function(postCode,callback){_callback = callback; _postcode=postCode; getPostCode(postCode)}
  }

  return rightmove;
}();

