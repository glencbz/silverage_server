var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    regImg = require('./regImg').regImg;

const ext = '.jpg';

function imgName(){
  return __dirname + '/upload_img/' + new Date().getTime() + ext;
}

function writeToFile(filePath, file, callback){
  var fstream = fs.createWriteStream(filePath);
  file.pipe(fstream);
  file.on('end', callback);
}

function retrieveExpiry(itemType){
  var d = new Date();

  // some meaningful number of days
  d.setDate(d.getDate() + 3);
  return d;
}

// function attachUpload(app){
//   app.post('/upload', imgPost);
// }

function objPost(app){
  mongoose.connect('mongodb://localhost/test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {

    var itemSchema = new Schema({
      type: String,
      //quantity: Number,
      expiryDate: Date,
      image: String,
      position: Array,
      weight: Number,
      spread: Number
    });

    var Item = mongoose.model('Item', itemSchema);

    app.post('/upload', (req, res) => {
      var imgPath = imgName();

      req.pipe(req.busboy);
      req.busboy.on('file', function(fieldname, file){
        writeToFile(imgPath, file, function(){
          var result = regImg(imgPath).result;

          // Expected parameters from client
          var dbValues = {
            type: result,
            expiryDate: retrieveExpiry,
            image: imgPath,
            position: req.body.position,
            weight: req.body.weight,
            spread: req.body.spread
          };

          var dbEntry = new Item(dbValues);
          dbEntry.save((err, entry) => {
            if (err)
              console.error(err);
            else
              console.log(entry);
          });
        });
      });
    });
  });
}

export {objPost};