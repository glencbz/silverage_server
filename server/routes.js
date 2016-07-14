var path = require('path');
module.exports = (app)=>{
  app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname + '/..' + '/dist/index.html'));
  });

  app.get('/jquery/jquery.min.js', (req,res) =>{;
    res.sendFile(path.join(__dirname + '/..' + '/node_modules/jquery/dist/jquery.min.js'));
  });

  app.get('/socket.io/socket.io.js', (req,res) =>{;
    res.sendFile(path.join(__dirname + '/..' + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js'));
  });
}