const express = require('express');

const path = require("path");
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
app.use(cors())

app.use('/', express.static(path.join(__dirname, "../build")));
app.use("/uploads", express.static("uploads"));


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



const multer = require("multer");
var storage = multer.diskStorage(
  {
      destination: './uploads/',
      filename: function ( req, file, cb ) {
          //req.body is empty...
          //How could I get the new_file_name property sent from client here?
          console.log(file, cb);
          cb( null, file.originalname);
      }
  }
);
const upload = multer({storage: storage});

app.post("/upload_files", upload.single("file"), uploadFiles);


function uploadFiles(req, res) {
  console.log(req.body);
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });

}


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


function randomShuffle(unshuffled) {
  let shuffled = unshuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  return shuffled;
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setIntersection(setA, setB) {
  let _intersection = new Set();
  for (const elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem);
      }
  }
  return _intersection;
}


function randomChoice(unshuffled) {
  return unshuffled[randomInt(0, unshuffled.length - 1)];
}

function range(start, stop, step = 1) {
  let a = [], b = start;
  if (step > 0) {
      while (b < stop) {
          a.push(b);
          b += step;
      }
  }
  else if (step < 0) {
      while (b > stop) {
          a.push(b);
          b += step;
      }
  }
  return a;
}


function arrayProduct(...arrays) {
  return arrays.reduce((prevAccumulator, currentArray) => {
      let newAccumulator = [];
      prevAccumulator.forEach(prevAccumulatorArray => {
          currentArray.forEach(currentValue => {
              newAccumulator.push(prevAccumulatorArray.concat([currentValue]));
          });
      });
      return newAccumulator;
  }, [[]]);
}

function arrayRepeat(array, n) {
  let r = [];
  for (let i = 0; i < n; ++i) {
      r.push(array.slice());
  }
  return r;
}


function generateRecursiveRiddle(number_of_statements, level = 8, max_solutions = 1) {
  if (number_of_statements <= 2) {
      return null;
  }
  if (level <= 0 || level >= 8) {
      return null;
  }
  if (max_solutions <= 0) {
      return null;
  }
  let false_true_arg = 1;
  let number_of_stmt_arg = 2;
  let even_odd_arg = 3;
  let stmt_index_arg = 4;
  let first_condition = [[
      `This is a numbered list of ${number_of_statements} statements.`,
      [],
      function (stmt, i, args) {
          return true;
      }
  ]];
  let check_for_exclusive = function (stmt, i, slc) {
      let lst = [];
      for (let i = 0; i < stmt.length; ++i) {
          lst.push([i, stmt[i]]);
      }
      lst = lst.slice_ext(...slc);
      for (let [x, _] of lst) {
          if (x === i) {
              return false;
          }
      }
      return true;
  }
  let first_level = [
      // "Exactly X of the previous/next statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(null, i);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the previous statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the next statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "Exactly X of the first/last/previous/next Y statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(null, args[2]);
              if (slice.length == args[2] && args[2] > args[1] && args[2] > 1 && check_for_exclusive(stmt, i, [null, args[2]])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the first ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(-args[2]);
              if (slice.length == args[2] && args[2] > args[1] && args[2] > 1 && check_for_exclusive(stmt, i, [-args[2], null])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the last ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i - args[2], i);
              if (slice.length == args[2] && args[2] > args[1] && args[2] > 1) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the previous ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1, i + 1 + args[2]);
              if (slice.length == args[2] && args[2] > args[1] && args[2] > 1) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the next ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "Exactly X of the even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(0 + args[2], null, 2);
              if (slice.length >= args[1] && check_for_exclusive(stmt, i, [0 + args[2], null, 2])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "Exactly X of the previous/next even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(0 + args[2], i, 2);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the previous ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1 + ((i % 2) == args[2]), null, 2);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the next ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "Exactly W of the statements X, Y and Z is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, stmt_index_arg, stmt_index_arg, stmt_index_arg],
          function (stmt, i, args) {
              let slice = args.slice_ext(2);
              let set = new Set();
              set.add(i);
              set.add(args[2]);
              set.add(args[3]);
              set.add(args[4]);
              if (set.size === 4 && args[1] <= 3) {
                  let x1 = stmt[i];
                  let x2 = slice.map((k) => stmt[k] == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the statements ${args[2] + 1}, ${args[3] + 1} and ${args[4] + 1} ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
  ];
  let second_level = [
      // "Either statement X or statement Y is true/false, but not both."
      [
          [stmt_index_arg, stmt_index_arg, false_true_arg],
          function (stmt, i, args) {
              if (i != args[0] && i != args[1] && args[0] != args[1]) {
                  let x1 = stmt[i];
                  let x2 = ((stmt[args[0]] == args[2]) ^ (stmt[args[1]] == args[2]));
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Either statement ${args[0] + 1} or statement ${args[1] + 1} is ${args[2] ? 'true' : 'false'}, but not both.`;
          }
      ],
      // "Either statement X or statement Y is true/false, or both."
      [
          [stmt_index_arg, stmt_index_arg, false_true_arg],
          function (stmt, i, args) {
              if (i != args[0] && i != args[1] && args[0] != args[1]) {
                  let x1 = stmt[i];
                  let x2 = ((stmt[args[0]] == args[2]) || (stmt[args[1]] == args[2]));
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Either statement ${args[0] + 1} or statement ${args[1] + 1} is ${args[2] ? 'true' : 'false'}, or both.`;
          }
      ],
      // "Statements X and Y are either both true or both false."
      [
          [stmt_index_arg, stmt_index_arg],
          function (stmt, i, args) {
              if (i != args[0] && i != args[1] && args[0] != args[1]) {
                  let x1 = stmt[i];
                  let x2 = stmt[args[0]] == stmt[args[1]];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Statements ${args[0] + 1} and ${args[1] + 1} are either both true or both false.`;
          }
      ],
  ];
  let third_level = [
      // "At least X or more of the previous/next statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(null, i);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the previous statements ${args[2] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the next statements ${args[2] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At most X or fewer of the previous/next statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(null, i);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the previous statements ${args[2] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the next statements ${args[2] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At least X or more of the first/last/previous/next Y statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(null, args[2]);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1 && check_for_exclusive(stmt, i, [null, args[2]])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the first ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(-args[2]);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1 && check_for_exclusive(stmt, i, [-args[2], null])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the last ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i - args[2], i);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the previous ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1, i + 1 + args[2]);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the next ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At most X or fewer of the first/last/previous/next Y statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(null, args[2]);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1 && check_for_exclusive(stmt, i, [null, args[2]])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the first ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(-args[2]);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1 && check_for_exclusive(stmt, i, [-args[2], null])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the last ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i - args[2], i);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the previous ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, number_of_stmt_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1, i + 1 + args[2]);
              if (slice.length === args[2] && args[2] > args[1] && args[2] > 1) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the next ${args[2]} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At least X or more of the even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(args[2], null, 2);
              if (slice.length >= args[1] && check_for_exclusive(stmt, i, [args[2], null, 2])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At most X or fewer of the even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(args[2], null, 2);
              if (slice.length >= args[1] && check_for_exclusive(stmt, i, [args[2], null, 2])) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At least X or more of the previous/next even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(args[2], i, 2);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the previous ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1 + ((i % 2) == args[2]), null, 2);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the next ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At most X or fewer of the previous/next even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(args[2], i, 2);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the previous ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = stmt.slice_ext(i + 1 + ((i % 2) == args[2]), null, 2);
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the next ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
  ];
  let fourth_level = [
      // "Exactly X of the previous/next or even/odd or previous/next even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = [];
              let false_condition = false;
              for (let k = 0; k < stmt.length; ++k) {
                  if (k < i || k % 2 === 0 && args[2] == false || k % 2 !== 0 && args[2] == true) {
                      slice.push(stmt[k]);
                      if (k === i) {
                          false_condition = true;
                          break;
                      }
                  }
              }
              if (false_condition) {
                  return false;
              }
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the previous or ${args[2] ? 'even' : 'odd'} or previous ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = [];
              let false_condition = false;
              for (let k = 0; k < stmt.length; ++k) {
                  if (k > i || k % 2 === 0 && args[2] == false || k % 2 !== 0 && args[2] == true) {
                      slice.push(stmt[k]);
                      if (k === i) {
                          false_condition = true;
                          break;
                      }
                  }
              }
              if (false_condition) {
                  return false;
              }
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() == args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `Exactly ${args[1]} of the next or ${args[2] ? 'even' : 'odd'} or next ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At least X or more of the previous/next or even/odd or previous/next even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = [];
              let false_condition = false;
              for (let k = 0; k < stmt.length; ++k) {
                  if (k < i || k % 2 === 0 && args[2] == false || k % 2 !== 0 && args[2] == true) {
                      slice.push(stmt[k]);
                      if (k === i) {
                          false_condition = true;
                          break;
                      }
                  }
              }
              if (false_condition) {
                  return false;
              }
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the previous or ${args[2] ? 'even' : 'odd'} or previous ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = [];
              let false_condition = false;
              for (let k = 0; k < stmt.length; ++k) {
                  if (k > i || k % 2 === 0 && args[2] == false || k % 2 !== 0 && args[2] == true) {
                      slice.push(stmt[k]);
                      if (k === i) {
                          false_condition = true;
                          break;
                      }
                  }
              }
              if (false_condition) {
                  return false;
              }
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() >= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At least ${args[1]} or more of the next or ${args[2] ? 'even' : 'odd'} or next ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      // "At most X or fewer of the previous/next or even/odd or previous/next even/odd statements is/are true/false."
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = [];
              let false_condition = false;
              for (let k = 0; k < stmt.length; ++k) {
                  if (k < i || k % 2 === 0 && args[2] == false || k % 2 !== 0 && args[2] == true) {
                      slice.push(stmt[k]);
                      if (k === i) {
                          false_condition = true;
                          break;
                      }
                  }
              }
              if (false_condition) {
                  return false;
              }
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the previous or ${args[2] ? 'even' : 'odd'} or previous ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
      [
          [false_true_arg, number_of_stmt_arg, even_odd_arg],
          function (stmt, i, args) {
              let slice = [];
              let false_condition = false;
              for (let k = 0; k < stmt.length; ++k) {
                  if (k > i || k % 2 === 0 && args[2] == false || k % 2 !== 0 && args[2] == true) {
                      slice.push(stmt[k]);
                      if (k === i) {
                          false_condition = true;
                          break;
                      }
                  }
              }
              if (false_condition) {
                  return false;
              }
              if (slice.length > args[1]) {
                  let x1 = stmt[i];
                  let x2 = slice.map((x) => x == args[0]).sum() <= args[1];
                  let s = x1 + x2;
                  return s === 0 || s === 2;
              }
              return false;
          },
          function (stmt, i, args) {
              return `At most ${args[1]} or fewer of the next or ${args[2] ? 'even' : 'odd'} or next ${args[2] ? 'even' : 'odd'} statements ${args[1] > 1 ? 'are' : 'is'} ${args[0] ? 'true' : 'false'}.`;
          }
      ],
  ];
  let stmt_conditions = [...first_level];
  if (level >= 2) {
      stmt_conditions.push(...second_level);
  }
  if (level >= 3) {
      stmt_conditions.push(...third_level);
  }
  if (level >= 4) {
      stmt_conditions.push(...fourth_level);
  }
  if (level >= 5) {
      stmt_conditions = stmt_conditions.slice(first_level.length);
  }
  if (level >= 6) {
      stmt_conditions = stmt_conditions.slice(second_level.length);
  }
  if (level >= 7) {
      stmt_conditions = stmt_conditions.slice(third_level.length);
  }
  let products = arrayProduct(...arrayRepeat([false, true], number_of_statements));
  let args_list = [];
  for (let [args, check_function, format_function] of stmt_conditions) {
      let all_args = [];
      for (let arg of args) {
          if (arg == false_true_arg || arg == even_odd_arg) {
              let new_all_args = [];
              if (all_args.length > 0) {
                  for (let x of all_args) {
                      for (let y of [false, true]) {
                          new_all_args.push(x.concat([y]));
                      }
                  }
              }
              else {
                  new_all_args = [[false], [true]];
              }
              all_args = new_all_args;
          }
          else if (arg == number_of_stmt_arg || arg == stmt_index_arg) {
              let k = 0 + (arg == number_of_stmt_arg);
              let new_all_args = [];
              if (all_args.length > 0) {
                  for (let x of all_args) {
                      for (let y of range(k, number_of_statements)) {
                          new_all_args.push(x.concat([y]));
                      }
                  }
              }
              else {
                  for (let y of range(k, number_of_statements)) {
                      new_all_args.push([y]);
                  }
              }
              all_args = new_all_args;
          }
      }
      if (all_args.length === 0) {
          all_args = [[]];
      }
      all_args = randomShuffle(all_args);
      args_list.push([all_args.slice_ext(0, 100), check_function, format_function]);
  }
  let stmt_values = [];
  let statements = [];
  let fail = true;
  while (fail) {
      let statements_values = [];
      while (statements_values.length === 0) {
          statements_values = [];
          for (let _ of range(1, number_of_statements)) {
              statements_values.push(randomChoice([false, true]));
          }
      }
      statements_values = [true].concat(statements_values);
      let stmt_variants = [first_condition];
      for (let i of range(1, number_of_statements)) {
          let variants = [];
          for (let [all_args, check_function, format_function] of args_list) {
              for (let args of all_args) {
                  let r = check_function(statements_values, i, args);
                  if (r === true) {
                      variants.push([format_function(statements_values, i, args), args, check_function]);
                  }
              }
          }
          if (variants.length > 0) {
              variants = randomShuffle(variants);
              stmt_variants.push(variants.slice_ext(0, 2));
              continue;
          }
          stmt_variants = [];
          break;
      }
      if (stmt_variants.length === 0) {
          continue;
      }
      let d = new Map();
      for (let [stmt_index, variants] of stmt_variants.entries()) {
          for (let [string, args, check_function] of variants) {
              let products_indices = [];
              for (let [i, prod] of products.entries()) {
                  let r = check_function(prod, stmt_index, args);
                  if (r === true) {
                      products_indices.push(i);
                  }
              }
              if (products_indices.length > 0) {
                  if (d.has(stmt_index) === false) {
                      d.set(stmt_index, new Map());
                  }
                  if (d.get(stmt_index).has(string) === false) {
                      d.get(stmt_index).set(string, new Set());
                  }
                  let tmp = d.get(stmt_index).get(string);
                  for (let x of products_indices) {
                      tmp.add(x);
                  }
              }
          }
          if (d.has(stmt_index) === false) {
              break;
          }
      }
      if (d.size < number_of_statements) {
          continue;
      }
      let tmp_list = [];
      for (let spi of d.values()) {
          tmp_list.push([...spi.entries()]);
      }
      let products_spi = arrayProduct(...tmp_list);
      for (let product_spi of products_spi) {
          let product_pis = new Set(product_spi[0][1]);
          for (let [_, p_pi] of product_spi.slice_ext(1)) {
              product_pis = setIntersection(product_pis, p_pi);
              if (product_pis.size === 0) {
                  break;
              }
          }
          if (product_pis.size === 0 || product_pis.size > max_solutions) {
              continue;
          }
          stmt_values = [];
          let false_check = false;
          for (let pis of product_pis) {
              let item = products[pis];
              stmt_values.push(item);
              if (item[0] === false) {
                  false_check = true;
                  break;
              }
          }
          if (false_check) {
              continue;
          }
          fail = false;
          statements = [];
          for (let t of product_spi) {
              statements.push(t[0]);
          }
          break;
      }
  }
  return [stmt_values, statements];
}
Array.prototype.sum = function () {
  return this.reduce(function (a, b) { return a + b; }, 0);
};


Array.prototype.slice_ext = function (start = null, end = null, step = null) {
  if (this.length === 0) {
      return [];
  }

  // start
  if (start == null) {
      start = 0;
  }
  else if (start < 0) {
      start = this.length + start;
  }
  start = Math.min(this.length - 1, Math.max(0, start));

  // end
  if (end == null) {
      end = this.length;
  }
  else if (end < 0) {
      end = this.length + end;
  }
  end = Math.min(this.length, Math.max(0, end));

  // step
  if (step == null) {
      step = 1;
  }
  let r = [];
  if (start < end && step > 0) {
      for (let i = start; i < end; i += step) {
          r.push(this[i]);
      }
  }
  else if (start > end && step < 0) {
      for (let i = start; i > end; i += step) {
          r.push(this[i]);
      }
  }
  return r;
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
      io.emit('getCurrentGame', {type:'Lock',problem});
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
