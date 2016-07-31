var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', function(){
	console.log('db opened');
});

var itemSchema = mongoose.Schema({
	itemType: String,
	expiryDate: Date,
	quantity: Number,
	unit: String,
	position: Array
});

var FridgeItem = mongoose.model('FridgeItem', itemSchema);

module.exports = FridgeItem;
