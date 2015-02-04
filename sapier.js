var fs = require('fs');

var filePath = null;
var lines = [];
var lineSwapOptionSet = false;
var numberSwapOptionSet = false;
var crudOptionSet = false;

console.log("File path:");
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    var input = chunk.toString().trim();
    if(filePath == null){
      filePath = input;
      processFile(filePath);
    }else if(input == 'a'){
      try{
        validateData(lines);
      }catch(e){
        console.error(e.message);
        process.exit(1);
      }
    }else if(lineSwapOptionSet){
      var indices = input.trim().split(/\s+/gmi);
      if(indices.length < 2){
        throw new Error('Missing '+(2-indices.length)+' or more parameters');
      }
      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if(isNaN(index)){
          throw new Error('"'+index+'" is not a number');
        }
      };
      var firstLineIndex = indices[0];
      var secondLineIndex = indices[1];
      lines.swap(firstLineIndex, secondLineIndex);
      lineSwapOptionSet = false;
    }else if(numberSwapOptionSet){
      var indices = input.trim().split(/\s+/gmi);
      if(indices.length < 4){
        throw new Error('Missing '+(4-indices.length)+' or more parameters');
      }
      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if(isNaN(index)){
          throw new Error('"'+index+'" is not a number');
        }
      };
      var firstLineIndex = indices[0];
      var firstNumberIndex = indices[1];
      var secondLineIndex = indices[2];
      var secondNumberIndex = indices[3];
      lines.swap2d(firstLineIndex, firstNumberIndex,
            secondLineIndex, secondNumberIndex);

      numberSwapOptionSet = false;
    }else if(crudOptionSet){
      var indices = input.trim().split(/\s+/gmi);
      var operation = indices.shift();
      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if(isNaN(index)){
          throw new Error('"'+index+'" is not a number');
        }
      };
      if(operation == 'create'){
        if(indices.length < 3){
          throw new Error('Missing '+(3-indices.length)+' or more parameters');
        }
        if(typeof lines[indices[0]] !='undefined'){
          lines[indices[0]].splice(indices[1], 0, indices[2]);    
        }else{
          throw new Error('Index out of bounds');
        }
      }else if(operation == 'read'){
        if(indices.length < 2){
          throw new Error('Missing '+(2-indices.length)+' or more parameters');
        }
        if(typeof lines[indices[0]][indices[1]] !='undefined'){
          console.log(lines[indices[0]][indices[1]]);
        }else{
          throw new Error('Index out of bounds');
        }
      }else if(operation == 'update'){
        if(indices.length < 3){
          throw new Error('Missing '+(3-indices.length)+' or more parameters');
        }
        if(typeof lines[indices[0]][indices[1]] !='undefined'){
          lines[indices[0]][indices[1]] = indices[2];
        }else{
          throw new Error('Index out of bounds');
        }
      }else if(operation == 'delete'){
        if(indices.length < 2){
          throw new Error('Missing '+(2-indices.length)+' or more parameters');
        }
        if(typeof lines[indices[0]][indices[1]] !='undefined'){
          lines[indices[0]].splice(indices[1], 1);    
        }else{
          throw new Error('Index out of bounds');
        }
      }else{
        console.error('Invalid operation');
      }
      crudOptionSet = false;
    }else if(input == 'b'){
      lineSwapOptionSet = true;
      console.log("Enter line indices:");
    }else if(input == 'c'){
      numberSwapOptionSet = true;
      console.log("Enter line and number indices:");
    }else if(input == 'd'){
      saveToFile(lines, filePath);
    }else if(input == 'e'){
      crudOptionSet = true;
      console.log('Enter operation("create", "read", "update" or "delete") '+
        'followed by the appropriate parameters');
    }else if(input == 'exit'){
        process.exit(0);
    }else{
      console.error('Unknown action: "%s", please try again', input);
    }

    if(!lineSwapOptionSet && !numberSwapOptionSet && !crudOptionSet){
      console.log('Choose action:\n\t"a" - Validate the file contents\n\t'+
        '"b" - Switch entire line from the file with an entire other line\n\t'+
        '"c" - Switch number at specific index in one line with a number with '+
        'specific index from another line\n\t'+
        '"d" - Validate and save the result\n\t'+
        '"e" - Apply \'CRUD\' operations on a selected position of a number\n\t'+
        '"exit" - Exit the application\n\t'
      );
    }
  }
});

function processFile(filePath) {
  fs.readFile(filePath, function(e, data){
      if (e){
        throw e;
      } 
    var fileContents = data.toString();

    var rawLines = fileContents.trim().split(/\n+/gmi);
    for (var i = 0; i < rawLines.length; i++) {
      var c = rawLines[i].trim().split(/\s+/gmi);
      for (var j = 0; j < c.length; j++) {
        if(c[j] == ''){
          c.splice(j, 1);
        }
      };
      lines.push(c);
    };
  });
}

function saveToFile(lines, filePath) {
  try{
    validateData(lines);
  }catch(e){
   console.error(e.message);
   process.exit(1);
  }
  var data = '';
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    for (var j = 0; j < l.length; j++) {
      data += (l[j]);
      if(j!=(l.length-1)){
        data +=' ';
      }
    };
    if(i!=(lines.length-1)){
      data +='\n';
    }
  };
  fs.writeFile(filePath, data, function (e) {
    if(e){
      throw e;
    }
    console.log('File "%s" saved!', filePath);
  });
}

Array.prototype.swap = function (a,b) {
  if(typeof this[a] != 'undefined' && typeof this[b] != 'undefined'){
    var t = this[a];
    this[a] = this[b];
    this[b] = t;
  }else{
    throw new Error('Index out of bounds');
  }
  return this;
}

Array.prototype.swap2d = function (a,b,c,d) {
  if(typeof this[a][b] != 'undefined' && typeof this[c][d] != 'undefined'){
    var t = this[a][b];
    this[a][b] = this[c][d];
    this[c][d] = t;
  }else{
    throw new Error('Index out of bounds');
  }
  return this;
}

function validateData(lines) {
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    for (var j = 0; j < line.length; j++) {
      var number = line[j];
      for (var k = 0; k < number.length; k++) {
        var digit = number[k];
        if(k == 0 && digit == 0){
          var errorMessage = 'line '+(i+1) +', number '+(j+1)+', '+
          'starts with 0';
          throw new Error(errorMessage);        
        }
        if(isNaN(digit)){
          var errorMessage = 'line '+(i+1) +', number '+(j+1)+', '+
          'character "'+digit+'"('+(k+1)+') is not allowed';    
          throw new Error(errorMessage);        
        }
      };
    };
  };
}