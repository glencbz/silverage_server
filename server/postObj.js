const fs = require('fs'),
      request = require('request'),
      endpoint = 'http://glenc.me:8080/upload/object';

module.exports = (filename, objBody, callback)=>{
  var req = request.post(endpoint, (err, res, body) => {
    if (err) 
      console.error(err);
    else 
      callback(body);
  });

  var form = req.form();
  form.append('file', fs.createReadStream(filename));

  for(var key in objBody){
    if (objBody.hasOwnProperty(key))
      form.append(key, objBody[key]);      
  }
};
