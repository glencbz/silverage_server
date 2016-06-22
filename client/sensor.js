function colorCell(arrayChoices, $sensorCells){
  for (var i = 0; i < arrayChoices.length; i++){
    for (var j = 0; j < arrayChoices[i].length; j++){
      var index = i * arrayChoices[i].length + j
      $($sensorCells[index]).css('background-color', 'rgb(' + (255 - arrayChoices[i][j]) + ',255,255)');
    }
  }
}

var socket = io.connect(window.location.href);

$(function(){
  var $sensorCells = $('.sensor-cell');
  var $picBtn = $('#pic-btn');
  var $shownPic = $('#shown-pic');
  var $resultLabel = $('#result-label');

  socket.on('ard', function (data) {
    var dataArray = JSON.parse(data);
    colorCell(dataArray, $sensorCells);
  });

  $picBtn.click(function(){
    $picBtn.addClass('clicked');
    $resultLabel.html(''); 
    socket.emit('takepic', 'pic');
    setTimeout(function(){
      $picBtn.removeClass('clicked');
    }, 100);
  });

  socket.on('showpic', function(fileName){
    $shownPic.css('background-image', 'url(' + fileName +'?' + new Date().getTime() + ')').addClass('active');
  });

  socket.on('reg_result', function(result){
    var lines = result.split('\n');
    var labelScores = lines.map((d)=>{
      var rawStrs = d.split(':');
      rawStrs[0] = rawStrs[0].substring(0, rawStrs[0].indexOf(')') + 1);
      rawStrs[1] = parseFloat(rawStrs[1].trim());
      return rawStrs
    });
    console.log(labelScores)
    labelScores = labelScores.filter((d)=>{
      return d[1] > .5;
    });
    console.log(labelScores);
    labelScores = labelScores != [] ? labelScores : 'Nothing detected!';
    console.log(result);
    $resultLabel.html(labelScores);
  });
});
