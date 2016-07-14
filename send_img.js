module.exports= (filename)=>{
  const fs = require('fs'),
      request = require('request'),
      imgEndpoint = 'http://glenc.me:8080/upload',

  sendFile: function (filename){
    var req = request.post(imgEndpoint, (err, res, body) => {
      if (err) {
        console.error(err);
      } else {
        console.log(body);
      }
    });
    var form = req.form();
    form.append('file', fs.createReadStream(filename));
  }
}
