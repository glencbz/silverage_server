function perc(d, singleScale){
  var denom = singleScale ? 200 : 1000;
   return 100 - Math.round(d / denom * 70)  + '%';
}

function objCol(colArray){
  return "hsla(" + [colArray[0], perc(colArray[1]), perc(colArray[2]), colArray[3]].join() + ")";
}

function cellCol(colArray){
  return "hsla(" + [colArray[0], perc(colArray[1], true), perc(colArray[2], true), colArray[3]].join() + ")";
}

export {objCol, cellCol};