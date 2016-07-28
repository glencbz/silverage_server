const fs = require('fs'),
      request = require('request'),
      imgEndpoint = 'http://glenc.me:8080/upload';

module.exports = (filename, callback)=>{
  var req = request.post(imgEndpoint, (err, res, body) => {
    if (err) 
      console.error(err);
    else 
      callback(body)
  });

  var form = req.form();
  form.append('file', fs.createReadStream(filename));
}
