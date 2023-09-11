const express = require('express');

// our localhost port
const port = 4000;

const app = express();

// our server instance
const server = require("http").createServer(app, {
  cors: {
    origin: "localhost:3000",
    methods: ["GET", "POST"]
  }
});
const cors = require('cors');

// This creates our socket using the instance of the server

const io = require('socket.io')(server, {
  cors: {
      origin: "http://localhost:3000"
  }
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

function returnNumberNotInArrays(array1, array2, array3) {
  while (true) {
      var randomInt = Math.floor(Math.random() * 10)
      if (!array1.includes(randomInt) && !array2.includes(randomInt) && !array3.includes(randomInt)) {
          return randomInt
      }
  }
}

function returnIndexNotEqual(index1,index2) {
  while (true) {
      var randomInt = Math.floor(Math.random() * 3)
      if (index1 != randomInt && index2 != randomInt) {
          return randomInt
      }
  }
}

function returnWrongNumberNotInArray(nothingIsCorrect, array) {
  while (true) {
      var randomInt = nothingIsCorrect[Math.floor(Math.random() * 3)]
      if (!array.includes(randomInt)) {
          return randomInt
      }
  }
}

function returnCorrectNumberNotEqual(correctCode, number1, number2) {
  while (true) {
      var randomInt = correctCode[Math.floor(Math.random() * 3)]
      if (number1 != randomInt && number2 != randomInt) {
          return randomInt
      }
  }
}

function returnNumberNotEqual(number) {
  while (true) {
      var randomInt = Math.floor(Math.random() * 10);
      if (number != randomInt) {
          return randomInt
      }
  }
}

function randomIntFrom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


function generateNew() {
  //Reset
  let twoCorrect = [-1, -1, -1]
  let oneCorrectAndWellPlaced = [-1, -1, -1]
  let oneCorrectButWrongPlaced1 = [-1, -1, -1]
  let oneCorrectButWrongPlaced2 = [-1, -1, -1]
  let nothingIsCorrect = [-1, -1, -1]
  let correctCode = [0, 0, 0]


  
  //Generate Correct Code
  correctCode[0] = returnNumberNotInArrays("", "", "")
  correctCode[1] = returnNumberNotInArrays(correctCode, "", "")
  correctCode[2] = returnNumberNotInArrays(correctCode, "", "")

  //Generate Hint 1
  var number1 = returnCorrectNumberNotEqual(correctCode, -1, -1)
  var number2 = returnCorrectNumberNotEqual(correctCode, number1, -1)
  var index1 = returnIndexNotEqual(correctCode.indexOf(number1), -1)
  var index2 = returnIndexNotEqual(correctCode.indexOf(number2), index1)
  twoCorrect[index1] = number1
  twoCorrect[index2] = number2

  //Generate Number For Hint 2,3,4
  let hint2number = returnCorrectNumberNotEqual(correctCode,-1, -1)
  let hint3number = returnCorrectNumberNotEqual(correctCode,hint2number, -1)
  let hint4number = returnCorrectNumberNotEqual(correctCode,hint2number, hint3number)

  //Generate Hint 2
  oneCorrectAndWellPlaced[correctCode.indexOf(hint2number)] = hint2number

  //Generate Hint 3
  if (twoCorrect.includes(hint3number)) {
      oneCorrectButWrongPlaced1[returnIndexNotEqual(correctCode.indexOf(hint3number), twoCorrect.indexOf(hint3number))] = hint3number
  } else {
      oneCorrectButWrongPlaced1[returnIndexNotEqual(correctCode.indexOf(hint3number))] = hint3number
  }


  //Generate Hint 4
  if (twoCorrect.includes(hint4number)) {
      oneCorrectButWrongPlaced2[returnIndexNotEqual(correctCode.indexOf(hint4number), twoCorrect.indexOf(hint4number))] = hint4number
  } else {
      oneCorrectButWrongPlaced2[returnIndexNotEqual(correctCode.indexOf(hint4number))] = hint4number
  }

  //Generate Nothing Is Correct
  nothingIsCorrect[0] = returnNumberNotInArrays(correctCode, "", "")
  nothingIsCorrect[1] = returnNumberNotInArrays(correctCode, nothingIsCorrect, "")
  nothingIsCorrect[2] = returnNumberNotInArrays(correctCode, nothingIsCorrect, "")

  //Replace All Empty -1
  var allEmptyPlaces = [];
  twoCorrect.forEach(function (item, index, array) { if (item == -1) { allEmptyPlaces.push(["hint1", index]) } })
  oneCorrectAndWellPlaced.forEach(function (item, index, array) { if (item == -1) { allEmptyPlaces.push(["hint2", index]) } })
  oneCorrectButWrongPlaced1.forEach(function (item, index, array) { if (item == -1) { allEmptyPlaces.push(["hint3", index]) } })
  oneCorrectButWrongPlaced2.forEach(function (item, index, array) { if (item == -1) { allEmptyPlaces.push(["hint4", index]) } })

  for (let i = 0; i < randomIntFrom(5,5); i++) {
      var emptyToReplace = allEmptyPlaces[Math.floor(Math.random() * allEmptyPlaces.length)]
      var arrayToReplaceFrom = emptyToReplace[0]
      var indexToReplace = emptyToReplace[1]
      allEmptyPlaces.splice(allEmptyPlaces.indexOf(emptyToReplace), 1)


      if (arrayToReplaceFrom == "hint1") {
          twoCorrect[indexToReplace] = returnWrongNumberNotInArray(nothingIsCorrect, twoCorrect)
      } else if (arrayToReplaceFrom == "hint2") {
          oneCorrectAndWellPlaced[indexToReplace] = returnWrongNumberNotInArray(nothingIsCorrect, oneCorrectAndWellPlaced)
      } else if (arrayToReplaceFrom == "hint3") {
          oneCorrectButWrongPlaced1[indexToReplace] = returnWrongNumberNotInArray(nothingIsCorrect, oneCorrectButWrongPlaced1)
      } else if (arrayToReplaceFrom == "hint4") {
          oneCorrectButWrongPlaced2[indexToReplace] = returnWrongNumberNotInArray(nothingIsCorrect, oneCorrectButWrongPlaced2)
      }
  }

  for (let i = 0; i < allEmptyPlaces.length+2; i++) {
      let emptyToReplace = allEmptyPlaces[Math.floor(Math.random() * allEmptyPlaces.length)]
      let arrayToReplaceFrom = emptyToReplace[0]
      let indexToReplace = emptyToReplace[1]
      allEmptyPlaces.splice(allEmptyPlaces.indexOf(emptyToReplace), 1)


      if (arrayToReplaceFrom == "hint1") {
          twoCorrect[indexToReplace] = returnNumberNotInArrays(correctCode, nothingIsCorrect, twoCorrect)
      } else if (arrayToReplaceFrom == "hint2") {
          oneCorrectAndWellPlaced[indexToReplace] = returnNumberNotInArrays(correctCode, nothingIsCorrect, oneCorrectAndWellPlaced)
      } else if (arrayToReplaceFrom == "hint3") {
          oneCorrectButWrongPlaced1[indexToReplace] = returnNumberNotInArrays(correctCode, nothingIsCorrect, oneCorrectButWrongPlaced1)
      } else if (arrayToReplaceFrom == "hint4") {
          oneCorrectButWrongPlaced2[indexToReplace] = returnNumberNotInArrays(correctCode, nothingIsCorrect, oneCorrectButWrongPlaced2)
      }
  }

  return({
      type: "crackTheCode",
      solution: correctCode, 
      hint1: twoCorrect[0] + " " + twoCorrect[1] + " " + twoCorrect[2],
      hint2: oneCorrectAndWellPlaced[0] + " " + oneCorrectAndWellPlaced[1] + " " + oneCorrectAndWellPlaced[2],
      hint3: oneCorrectButWrongPlaced1[0] + " " + oneCorrectButWrongPlaced1[1] + " " + oneCorrectButWrongPlaced1[2],
      hint4: oneCorrectButWrongPlaced2[0] + " " + oneCorrectButWrongPlaced2[1] + " " + oneCorrectButWrongPlaced2[2],
      hint5: nothingIsCorrect[0] + " " + nothingIsCorrect[1] + " " + nothingIsCorrect[2]
  })
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}


function generateBongo() {
  let array = [
  {type: "yellow", value: Math.floor(3*Math.random())},
  {type: "yellow", value: Math.floor(3*Math.random())},
  {type: "green", value: Math.floor(3*Math.random())},
  {type: "red", value: Math.floor(3*Math.random())},
  {type: "red", value: Math.floor(3*Math.random())},
  {type: "blue", value: Math.floor(3*Math.random())},
  {type: "blue", value: Math.floor(3*Math.random())},
  {type: "blue", value: Math.floor(3*Math.random())},
  {type: "blue", value: Math.floor(3*Math.random())},
  {type: "blue", value: Math.floor(3*Math.random())},
  ]
  shuffleArray(array);
  return array;
}






function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


let problem = generateNew();
// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);
  
  
  //Listens and logs the message to the console
  socket.on('getProblem', (data) => {
      console.log('getProblem', problem);
      io.emit('getCurrentGame', {problem});
  });



  //Listens and logs the message to the console
  socket.on('solution', (data) => { 
      console.log(data,problem);
      if(arraysEqual(problem.solution,data)) {
        problem = generateNew()
        console.log("success");
        io.emit('getNewGame', {problem});
        io.emit('success', {problem});
      }
  });

  //Listens and logs the message to the console
  socket.on('message', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
})


server.listen(port, () => console.log(`Listening on port ${port}`))
