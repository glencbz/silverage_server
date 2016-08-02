import $ from 'jquery';

var objectRoute = 'objects';

export default function(callback){
  $.ajax({
    url: objectRoute, 
    success: (result)=>{
      callback(result);
    }
  });
};