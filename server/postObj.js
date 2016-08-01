const fs = require('fs'),
      request = require('request'),
      endpoint = 'http://glenc.me:8080/upload/object';
      // endpoint = 'http://httpbin.org/post';

module.exports = (filename, objBody, callback)=>{

  var formData = {
    file: fs.createReadStream(filename),
  };

  for(var key in objBody){
    if (objBody.hasOwnProperty(key)){
      formData[key] = objBody[key];
    }
  }

  var req = request.post({url:endpoint, formData: formData}, (err, res, body) => {
    if (err) 
      console.error(err);
    else 
      callback(res);
  });

  // var form = req.form();
  // form.append('file', fs.createReadStream(filename));

  // for(var key in objBody){
  //   if (objBody.hasOwnProperty(key)){
  //     form.append(key, JSON.stringify(objBody[key]));      
  //   }
  // }
};
