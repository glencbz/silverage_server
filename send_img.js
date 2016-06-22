const fs = require('fs'),
      request = require('request'),
      imgEndpoint = 'http://glenc.me:8080/upload';

module.exports=function(socket){
  return (filename)=>{
    var req = request.post(imgEndpoint, (err, res, body) => {
      if (err) {
        console.error(err);
      } else {
        socket.emit('reg_result', body);
      }
    });
    var form = req.form();
    form.append('file', fs.createReadStream(filename));
  }
}

