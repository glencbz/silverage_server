function colorCell(arrayChoices, $sensorCells){
  for (var i = 0; i < arrayChoices.length; i++){
    if (arrayChoices[i])
      $($sensorCells[i]).addClass('sensor-on');
    else
      $($sensorCells[i]).removeClass('sensor-on');
  }
}

var socket = io.connect('http://localhost:5000');
socket.on('news', function (data) {
  console.log(data);
});

$(function(){
  var $sensorCells = $('.sensor-cell');
  var $picBtn = $('#pic-btn');
  var $shownPic = $('#shown-pic');

  socket.on('ard', function (data) {
    var dataArray = JSON.parse(data);
    colorCell(dataArray, $sensorCells);
  });

  $picBtn.click(function(){
    $picBtn.addClass('clicked');
    socket.emit('takepic', 'pic');
    setTimeout(function(){
      $picBtn.removeClass('clicked');
    }, 100);
  });

  socket.on('showpic', function(fileName){
    $shownPic.css('background-image', 'url(' + fileName + ')').addClass('active');

  });
});
