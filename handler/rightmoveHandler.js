module.exports = function() {

    var http = require('http');
    var fs = require('fs');
    var _callback;
    var _postcode;
    var _days;
    var _radius;
    var _webSiteID = 2;
    var _done;
    var _loop;
    var _options = {
        host: "www.rightmove.co.uk", 
        port: 80,
        path: '',
        method: 'GET'
    };

    getPropertyValues = function(link){
        _options.path = link;
        var result = "";
        http.request(_options, function(res) {

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

        _options.path = "/property-for-sale/find.html?locationIdentifier="+ newPostCode+
        "&insId=3&maxDaysSinceAdded="+_days+"&radius="+ _radius+".0&index="+ (_loop*10);
  	     var result = "";
  	     http.request(_options, function(res) {
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

    getPostCode = function(){
        _options.path = "/property-for-sale/search.html?searchLocation=" + _postcode +
         "&locationIdentifier=&useLocationIdentifier=false&buy=For+sale";
        var result = "";
        http.request(_options, function(res) {
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

        result =[];
        fs.writeFile("./html.html", html  , function(err) {
                if(err) {
                    return console.log(err);
                }
        });
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

        webSitePropertyID;

        _callback ({type:type,bedroomno:nobed,firstprice: price ,firstdate : date, lastdate : date,postcode : postcode, agentname :agentN, agentpostCode :agentP, "webSiteID" : _webSiteID, 'webSitePropertyID' : webSitePropertyID });
    }


    var parsePostCode = function(html){
        return (/(POSTCODE)\^\d*/).exec(html)[0];
    }

    var parsePropertiesLink = function(html){
        links = [];

        crappylinks = (html.match(/\/new-homes-for-sale\/property-\d+.html/g));
        if (crappylinks === null){
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

    var pushIfNew = function(obj,array) {
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
        return ""+ year + "-" + months[month] +"-" + day;
    }   

    var rightmove = {
        "getResults" : function(postcode,radius,days,callback,done){_done = done;_callback = callback; _postcode=postcode; _radius= radius;_loop = 0; _days = days; getPostCode()}
    }

    return rightmove;
}();

