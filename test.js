st0 = "2 bedrooms";
st2 = "1 master bedrooms";
st3 = "";
st4 = "3 medium bedrooms and 10 large bedrooms";

var pushIfNew = function(obj,array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) { // modify whatever property you need
            return;
        }
    }
    array.push(obj);
}


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

var matcher = function(st1){

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


console.log(matcher(st0));
console.log(matcher(st2));

console.log(matcher(st3));

console.log(matcher(st4));




