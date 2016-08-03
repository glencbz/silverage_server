var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    regImg = require('./regImg').regImg,
    fs = require('fs'),
    path = require('path');

const ext = '.jpg';

function imgName(){
  return path.join(__dirname, '../upload_img', new Date().getTime() + ext);
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

function formDbObject(req, callback){
  var dbValues = {
    position: []
  };

  var imgPath = imgName();

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file){
    writeToFile(imgPath, file, function(){
      var result = regImg(imgPath).result;
      dbValues.type = result;
      dbValues.expiryDate = retrieveExpiry(result);
      dbValues.image = path.basename(imgPath);
    });
  });

  req.busboy.on('field', (fieldname, val) =>{
    if (fieldname == 'position')
      dbValues[fieldname].push(val);
    else
      dbValues[fieldname] = val;
  })

  req.busboy.on('finish', () =>{
    callback(dbValues);
  });
}

function dbRoutes(app){
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

    app.post('/upload/object', (req, res) => {
      formDbObject(req, (dbValues) =>{
        var dbEntry = new Item(dbValues);
        dbEntry.save((err, entry) => {
          if (err)
            console.error(err);
          else
            console.log(entry);
        });
      });
    });

    app.post('/delete/object', (req, res) => {
      formDbObject(req, (dbValues) =>{
        Item.find(dbValues)
        .remove((err, entry) => {
           if (err)
            console.error(err);
          else
            console.log(entry.result);         
        });
      });
    });

    app.get('/objects', (req, res) =>{
      Item.find({}, (err, items) => {
        res.send(items);
      });
    });
  });
}

module.exports={dbRoutes};
