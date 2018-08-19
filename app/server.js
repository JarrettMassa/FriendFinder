// Require dependencies
var fs = require("fs");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

// Set our port to 8080
var PORT = 8080;
var app = express();

var bestMatchUser = {};
var bestMatchScore = 9999;

currentUser = {};
currentScore = 0;
// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var friends;

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/home.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/survey.html"));
});

app.get("/api/friends", function(req, res) {
  res.sendFile(path.join(__dirname, "/data/friends.js"));
});

app.post("/api/friends", function(req, res) {
  var newFriend = req.body;
  currentScore = 0;
  bestMatchUser = {};
  bestMatchScore = 9999;

  fs.readFile("data/friends.js", "utf8", function(err, data) {

    var dataJSON = JSON.parse(data);
    var allUserData = [];

    for(var i in dataJSON) {
      allUserData.push(dataJSON[i]);
    }

    allUserData.push(newFriend);

    var dataKeyLength = Object.keys(dataJSON).length;

    for (var i = 0; i < dataKeyLength; i++){
      for (var j = 0; j < 10; j++){
        currentScore += Math.abs(newFriend.scores[j] - dataJSON[i].scores[j]);
      }

      if (currentScore < bestMatchScore){
        bestMatchUser = dataJSON[i];
        bestMatchScore = currentScore;
      }
      currentScore = 0; 
    }

    fs.writeFile("data/friends.js",JSON.stringify(allUserData), function(err, data) {});
    res.json(bestMatchUser); 
  });


});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
