const fs = require('fs'),
      request = require('request'),
      addEndpoint = 'http://glenc.me:8080/upload/object',
      delEndpoint = 'http://glenc.me:8080/delete/object';

function postToEndpoint(url){
  return (filename, objBody, callback)=>{
    var formData = filename ? {
      file:  fs.createReadStream(filename),
    } : {};

    for(var key in objBody){
      if (objBody.hasOwnProperty(key)){
        formData[key] = objBody[key];
      }
    }

    var req = request.post({url, formData}, (err, res, body)=>{
      if (err) 
        console.error(err);
      else 
        callback(res);
    });
  };
}

module.exports = {
  add: postToEndpoint(addEndpoint),
  del: postToEndpoint(delEndpoint)
};