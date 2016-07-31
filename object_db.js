var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var itemSchema = new Schema({
  type: String,
  quantity: Number,
  expiryDate: Date,
  image: {
    data: Buffer,
    type: String
  }
});