// Constructor
function Property(type,nobedrooms,postcode,stateagent,price,datelisting) {
  this.type = type;
  this.nobedrooms = nobedrooms;
  this.postcode = postcode;
  this.stateagent = stateagent;
  this.price = price
  this.datelisting = datelisting
}

// export the class
module.exports = Property;