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
    var _maxLoop;


    //var fakehost = "http://www.rightmove.co.uk"
    var fakehost = ""
    var _options = {
        //host: "us-dc.proxymesh.com",
        host: "www.rightmove.co.uk",     
        password:"",
        cookie:"Cookie: cks_policy=TT; rmmvao_591=B__1__ST42CT9SE41EHS45AP409M6YFIDWUW6O; __utma=6980913.339448617.1456347154.1457637327.1457641607.15; beta_optin=N:55:45; _ga=GA1.3.339448617.1456347154; rmmvao_592=C__1__OU92A2QS6SS29PBCU60BIIYYOQ8ORBG9; __utmv=6980913.computer|1=source=direct-none=1^2=keyword=not-provided=1^3=user=buy=1; TPCminPrice=60000; TPCmaxPrice=160000; topPCRSearch=LS22%206LN; ki_t=1456349714030%3B1457637424468%3B1457641646409%3B6%3B54; ki_r=; PDCinvestmentLastVisitDate=1456537759216; permuserid=160224FV90J388TWKRNTGN7RX2S4ZQCX; svr=3109; TS01ec61d1=012f990cd3ca3b1c2df017c67756216eb0cc5f87e52a5fad1df08cf67414c179e2676ba1062afa63d47065d7ca0b9f131ad29f6770532f05e5aff459d322cdb679e1f1fbfb; JSESSIONID=8AC151A27BAE9763ADA693ED5C37EAE0; rmsessionid=635a984c-a6b6-4096-af22-043ea51fd6e1; TS019c0ed0=012f990cd302650e4279ffe06c7b4ca59426d5d9ab6caf4fe28cabb94e021fefab26ffcbc9eb98b4dff119c5f28ed7f18f263fc1a1a04c007cd3d904ebd4bd27b48d7a0add2786b6f968266915bee9122622cbc5654623a0576fca5afc7b7140d22cf11dd074eb23b24077b8407028560b5b77072e; TS019c0ed0_28=0186df1e987052f365866ff505f0aee860d13c641959697ca7d649d6a60d086571ae40f8ef9c8f5f8cc684ebbb7520f3250367f3e8; rmtcj=9851; __utmc=6980913; __utmz=6980913.1457637327.14.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); TS019c0ed0_77=2872_c7d6229cb6741a26_rsb_0_rs_%2Fproperty-for-sale%2Ffind.html_rs_2_rs_0; __utmb=6980913.22.8.1457641627182; __utmt=1",
        Referer: "http://www.rightmove.co.uk/property-for-sale/search.html?searchLocation=LS22+6LN&locationIdentifier=&useLocationIdentifier=false&buy=For+sale",
        port: '80',
        path: '',
        method: 'GET',
        headers: { 
             'Proxy-Authorization': 'Basic '+ new Buffer("tinoliam:333tres").toString('base64'),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:44.0) Gecko/20100101 Firefox/44.0',
        'Content-Type' : 'application/x-www-form-urlencoded' 
        }
    };



    getPropertyValues = function(link,callback){
        _options.path = fakehost+link;

        var result = "";

        http.request(_options, function(res) {

            res.setEncoding('utf8');
        
            res.on('data', function (chunk) {
                result += chunk; 
            });

            res.on('end',function(){
                //console.log(result);
                parseProperty(result,link.match(/\d+/)[0],callback);
            });
        }).end( );
    }




    var getAll = function(){
        var pathpath = "/property-for-sale/find.html?locationIdentifier=USERDEFINEDAREA^{%22polylines%22%3A%22szvoHtegT%60r%60DnnnMik_ClmbFwnhKynyC_coD{nyCyqtCjq|HqcgBtvmIshkDixv%40ep|KhdP{}wKq~zKumqD_xkJfpzBkb|QrooB}flAlueVguvKpm|DgqcLlmuI|nr%40%60myJd}cNjhiA|hrV%22}&sortType=&numberOfPropertiesPerPage=50";
        var loop = _loop;
        _options.path = pathpath;
        if (loop == 0) {
            _options.path = pathpath;
        }
        else{
            console.log(loop +" de "+ _maxLoop);
            _options.path = pathpath +"&index="+ (loop*50);
        }
        console.log(_options.path);
        var result = "";
        try {
        var request = http.request(_options, function(res,err) {
            res.setEncoding('utf8');
            
            res.on('data', function (chunk) {
               result += chunk; 
            });



            res.on('end',function(){

                    var jsonA = result.match(/(\<script\>window\.jsonModel)\s\=\s.+(\<\/script\>)/);
                    if (jsonA === null) {
                        getAll();
                    }
                    else {
                        _loop++;
                        var json = eval("["+jsonA[ 0 ].substring(27 , jsonA[0].length-9)+"]")[0];
                        //Start the loop variables.
                        if (loop == 0) {
                            console.log(  json["resultCount"] == undefined ? json : json['resultCount'] );
                             _maxLoop = json['resultCount'].replace(',' , "") / 50;
                             if (_maxLoop % 1 != 0) {
                                if (_maxLoop % 1 >= 0.5){
                                    _maxLoop = Math.round(_maxLoop);
                                }
                                else{
                                    _maxLoop = Math.round(_maxLoop) + 1;
                                }
                            }
                        }
                        //start the loop function
                        getJsonArrMongo(json,function(){
                            if (loop > _maxLoop){
                                _done();
                            }
                            else{
                                getAll();
                            }
                        });
                }

            });
        });
        request.on('error', function (e) {
          // General error, i.e.
          //  - ECONNRESET - server closed the socket unexpectedly
          //  - ECONNREFUSED - server did not listen
          //  - HPE_INVALID_VERSION
          //  - HPE_INVALID_STATUS
          //  - ... (other HPE_* codes) - server returned garbage
            console.log(e);
            request.abort();
            getAll();
        });
/*
        request.on('timeout', function () {
              // Timeout happend. Server received request, but not handled it
              // (i.e. doesn't send any response or it took to long).
              // You don't know what happend.
              // It will emit 'error' message as well (with ECONNRESET code).

              console.log('timeout');
              request.abort();
              getAll();
        });
*/
        request.setTimeout(1000);
        request.end();


        }
        catch (err){
           console.log(err);getAll();
        }


    };


var getJsonArrMongo = function(json,callback){
    for (var i = json["properties"].length - 1; i >= 0; i--) {
        var prop = json["properties"][i];
        _callback(prop);
        if (i == (json["properties"].length -1)) {callback();}
    }
}


    function getQuery(){
        var loop = _loop;
        if (loop == 0) {
            _options.path = fakehost +"/property-for-sale/find.html?searchType=SALE&locationIdentifier=" + _newPostCode +
            "&insId=1&radius="+ _radius +".0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=&displayPropertyType=&" +
            "maxDaysSinceAdded=" + _days +"&_includeSSTC=on&sortByPriceDescending=&primaryDisplayPropertyType=&" + 
            "secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&numberOfPropertiesPerPage=50&newHome=&auction=false";
            console.log("starting on RightMove");
        }
        else{ 
            console.log(loop +" de "+ _maxLoop);
            _options.path = fakehost +"/property-for-sale/find.html?locationIdentifier="+ _newPostCode+
                "&insId=3&maxDaysSinceAdded="+_days+"&radius="+ _radius+".0&numberOfPropertiesPerPage=50&index="+ (loop*50);
        
        }
  	     var result = "";
  	    var request =  http.request(_options, function(res) {
    		res.setEncoding('utf8');
    		
    		res.on('data', function (chunk) {
  			   result += chunk; 
            });

            res.on('end',function(){
                //console.log(result);
                
                //_maxLoop = result.match(/(\<script\>window\.jsonModel)\s\=\s.+(\<\/script\>)/)[0];
                    //_maxCant = ((a = result.match(/(atter\"\>)[\d\,]+(\<\/span)/)) !== null ? a[0].match(/[\d\,]+/)[0].replace(',',"")/1 : 1000);
                    //_maxLoop = _maxCant/50;
                    //console.log(_maxLoop);
                    setTimeout(function() {

                    var jsonA = result.match(/(\<script\>window\.jsonModel)\s\=\s.+(\<\/script\>)/);
                    if (jsonA === null) {
                        getQuery();
                    }
                    else {
                        _loop++;
                        var json = eval("["+jsonA[ 0 ].substring(27 , jsonA[0].length-9)+"]")[0];
                        if (loop == 0) {
                            console.log(  json["resultCount"] == undefined ? json : json['resultCount'] );

                             _maxLoop = json['resultCount'].replace(',' , "") / 50;
                             if (_maxLoop % 1 != 0) {
                                if (_maxLoop % 1 > 0.5){
                                    _maxLoop = Math.round(_maxLoop);
                                }
                                else{
                                    _maxLoop = Math.round(_maxLoop) + 1;
                                }
                            }
                        }
                        getJsonArr(json,function(){
                            if (loop > _maxLoop){
                                _done();
                            }
                            else{
                                getQuery();
                            }
                        });
                    //parseAlternative(result.match(/(\<script\>window\.jsonModel)\s\=\s.+(\<\/script\>)/)[0]);
                    /*var links = parsePropertiesLink(result, _newPostCode);
                    var count = 0;
                    var callback = function(){
                        count++;
                        console.log(count+" a "+ links.length + " :: " + loop + " "+ _maxLoop);
                        if (count == links.length){
                            if (loop > _maxLoop)
                                {_done();console.log("asd");}
                            else
                                {_loop++;getQuery();console.log("asd");}
                        }
                    };
                    for (var i = links.length - 1; i >= 0; i--) {
                        getPropertyValues(links[i],callback);
                    }*/
                }
            }, 2000);
            });



        }).end( );
        request.on('error', function(error) {
          console.error(error);getQuery();

        });
    }





var getJsonArr = function(json,callback){
    for (var i = json["properties"].length - 1; i >= 0; i--) {
        var prop = json["properties"][i];
        var date = new Date(prop['autoEmailDate']).toISOString().substring(0,10);
        _callback({type:prop['propertySubType'],bedroomno: prop['bedrooms'], firstprice:prop['displayPrices'][0]['displayPrice'].replace(/[\,\£]/g,""),
            'firstdate' : date, lastdate : date, postcode: _postcode, agentN : prop['customer']['brandTradingName'],
            agentpostCode : prop['customer']['branchDisplayName'], webSiteID : _webSiteID, webSitePropertyID : prop['id'], distanceToPostCode : prop['distance']});
        if (i == (json["properties"].length -1)) {callback();}
    }
}



    getPostCode = function(){
        _options.path = fakehost +"/property-for-sale/search.html?searchLocation=" + _postcode +
         "&locationIdentifier=&useLocationIdentifier=false&buy=For+sale";
        var result = "";
        http.request(_options, function(res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                result += chunk; 
            });

            res.on('end',function(){
                if ( (a = parsePostCode(result) ) !== null )
                    {_newPostCode= a;getQuery();}
                else { _done()}
            });
        }).end();
    }

    parseProperty = function(html,id,callback1){

        result =[];
        fs.writeFile("./html.html", html  , function(err) {
                if(err) {
                    return console.log(err);
                }
        });
        //if ((html.match(/(\"BD\"\:\[\")\w*(\"\])/)) === null ) {return;}
        //type = html.match(/(\"BD\"\:\[\")\w*(\"\])/)[0].split("[")[1];
        //type = type.replace(/\"/g,"");
        //type = type.replace(/\]/,"");
        type = html.match(/(propertyType)\=[\w\s]+/)[0].split("=")[1];


        nobed = bedRoomsMatcher(html);
        postcode = _postcode.replace("+", " ");

        agent = html.match(/(ontactagent-footer)[\s\S]{1,5000}(\<\/address)/)[0];
        agentN = agent.match(/(\>).+(\<\/s)/)[0];
        agentN = agentN.match(/([\w\,\s]+)/g)[1];

        agentP = agent.match(/\w{3}\s\w{3}/g);
        agentP = agentP[agentP.length -1];
        price = (((a = html.match(/\&(pound)\;[\d\,]+\<\/(strong)\>/)) !== null ) ? a[0].match(/[\d\,]+/)[0].replace(/\,/g,"") : '?' );
        //price = html.match(/(\"listing\_totalvalue\"\:)\d+/)[0];
        //price = price.match(/\d+/)[0];

        date = (((a = html.match(/(firstListedDateValue\"\>)[\w\s]+/)) !== null )? dateToYYYYMMDD(a[0].match(/\d{1,2}\s[\w]+\s\d{4}/)[0]) : '?');

        webSitePropertyID = id;
        //console.log({type:type,bedroomno:nobed,firstprice: price ,firstdate : date, lastdate : date,postcode : postcode, agentname :agentN, agentpostCode :agentP, "webSiteID" : _webSiteID, 'webSitePropertyID' : webSitePropertyID });
        _callback({type:type,bedroomno:nobed,firstprice: price ,firstdate : date, lastdate : date,postcode : postcode, agentname :agentN, agentpostCode :agentP, "webSiteID" : _webSiteID, 'webSitePropertyID' : webSitePropertyID });
        callback1();
    }


    var parsePostCode = function(html){
        return ((a =html.match(/(POSTCODE)\^\d*/) ) !== null ? a[0] : a);
    }

    var parsePropertiesLink = function(html){
        links = [];

        crappylinks = (html.match(/\/property-for-sale\/property-\d+.html/g));
        if (crappylinks === null){
            fs.appendFile("./error.html", html  , function(err) {
                if(err) {
                    return console.log(err);
                }
            });
            return [];
        }
        for (var i = 0; i < crappylinks.length; i++) {
            if (crappylinks[i].match(/\d+/)[0] != 0)
                {
                    pushIfNew(crappylinks[i],links);
                }
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

    var bedRoomsMatcher = function(st1){

        var getDistinct = function(a){
            var distincts = [];
            var count = 0;
            for (var i = a.length - 1; i >= 0; i--) {
                pushIfNew(a[i],distincts);
            }
            for (var i = distincts.length - 1; i >= 0; i--) {
                count += ((a = distincts[i].match(/\d*/)) !== null  ? parseInt(a[0]) : 0);
            }   
            return count;
        };

        return ( (a = st1.match(/\d+\s(bedroom)/i)) !== null ? a[0].match(/\d*/)[0] : (
            (a = st1.match(/(\d+\s\w+\s(bedroom)|\w+\s(bedroom))/g)) === null ? 0 :
                getDistinct(a)
            )  
        );
    }  

    var initQuery = function(callback,done,funct,postcode,radius,days){
        _done = done;
        _callback = callback || console.log;
        _postcode = postcode || '?';
        _radius = radius || 5;
        _loop = 686;
        _days = days || 1;
        _maxLoop = 8556;
        funct();
    }
    var rightmove = {
        "getResults" : function(postcode,radius,days,callback,done){initQuery(callback,done,function(){getQuery()},postcode,radius,days)},
        "getAll" : function(callback,done){initQuery(callback,done,function(){getAll()} )}
    }

    return rightmove;
}();

