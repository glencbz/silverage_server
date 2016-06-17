module.exports = (app)=>{
  app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/client/index.html');
  });

  app.get('/*', (req,res) =>{
    console.log(decodeURI(req.url));
    res.sendFile(__dirname + decodeURI(req.url));
  });
}