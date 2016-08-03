var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

var expirySchema = new Schema({
  type: String,
  expiryDays: Number,
});

var Expiry = mongoose.model('Expiry', expirySchema);
/*
var itemTypes = [
  'milk carton',
  'yoghurt',
  'milo',
  'orange',
  'chocolate',
  'juice carton',
  'cheese',
  'green apple',
  'red apple',
  'soya sauce',
  'kaya',
  'ketchup'
];

var expiries = [
  6,
  8,
  120,
  90,
  300, 
  150,
  14,
  45,
  45,
  1095,
  60,
  365
];

for (var i = 0; i < itemTypes.length; i++){
  var exp = new Expiry({
    type: itemTypes[i],
    expiryDays: expiries[i]
  });

  exp.save((err, entry) => {
    if (err)
      console.error(err);
    else
      console.log(entry);
  });
}
*/

var exp = new Expiry({
  type: 'banana',
  expiryDays: 5
}).save((e, en) => {console.log(en)});
