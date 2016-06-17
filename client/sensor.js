function colorCell(arrayChoices, $sensorCells){
  for (var i = 0; i < arrayChoices.length; i++){
    if (arrayChoices[i])
      $($sensorCells[i]).addClass('sensor-on');
    else
      $($sensorCells[i]).removeClass('sensor-on');
  }
}

$(function(){
  var $sensorCells = $('.sensor-cell');

  socket.on('ard', function (data) {
    var dataArray = JSON.parse(data);
    colorCell(JSON.parse(dataArray.data), $sensorCells);
  });
});

var socket = io.connect('http://localhost:5000');
socket.on('news', function (data) {
  console.log(data);
});