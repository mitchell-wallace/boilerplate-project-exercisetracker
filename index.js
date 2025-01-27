const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// creates 1 new user and returns this user's username and _id
app.post('/api/users', (req, res) => {
  var newUser = {
    'username': req.body.username,
    '_id': generateId()
    }
  users.push(newUser);
  res.json(newUser);
});

// returns all users in array
app.get('/api/users', (req, res) => {
  const selectedAttributes = ["username", "_id"];

  const result = users.map(obj => {
    const newObj = {};
    selectedAttributes.forEach(attr => {
      newObj[attr] = obj[attr];
    });
    return newObj;
  });

  res.json(result);
});

// find user by id and log 1 new exercise session
app.post('/api/users/:_id/exercises', findUser, (req, res) => {
  // validate remaining inputs
  if (!req.body.description) {
    res.json({"error":"Description is missing"});
    return;
  }
  if (!req.body.duration || isNaN(req.body.duration)) {
    res.json({"error":"Duration is not a number or is missing"});
    return;
  }
  var date;
  if (!req.body.date) date = new Date().toDateString();
  else date = new Date(req.body.date).toDateString();
  if (date.toString() == "Invalid Date") {
    res.json({"error":"Invalid date supplied"});
    return;
  }

  // add exercise to user's log and send response
  if (!users[req.params.index].log) users[req.params.index].log = [];
  users[req.params.index].log.push({
    'description': req.body.description,
    'duration': parseInt(req.body.duration),
    'date': date
  });
  res.json({"username":users[req.params.index].username,
    "_id":req.params._id,
    'description': req.body.description,
    'duration': parseInt(req.body.duration),
    'date': date});
});

// find user by id and return exercise logs for that user
app.get('/api/users/:_id/logs', findUser, (req, res) => {
  // test for and validate optional query params
  // e.g. /api/users/:_id/logs?limit=1&from=01-01-2000&to=01-01-2010
  var limit = req.query.limit ? Number.parseInt(req.query.limit) : false;
  var from = req.query.from ? new Date(req.query.from) : false;
  if (isNaN(from.valueOf())) from = false;
  var to = req.query.to ? new Date(req.query.to) : false;
  if (isNaN(to.valueOf())) to = false;

  // filter logs if necessary
  var result;
  if (to || from || limit) {
    result = [];
    for (var i = 0; i < users[req.params.index].log.length; i++) {
      if (to || from) {
        let exDate = new Date(users[req.params.index].log[i].date);
        if ((to && exDate > to) || (from && exDate < from)) continue;
      }
      if (limit && result.length >= limit) continue;
      result.push(users[req.params.index].log[i]);
    }
  }
  else result = users[req.params.index].log;

  // return user with filtered logs
  res.json({"username":users[req.params.index].username,
    "count":result.length,
    "_id":req.params._id,
    "log":result});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

// helper middleware to validate Id and find the index to the user
function findUser(req, res, next) {
  // validate id
  if (!req.params._id || req.params._id == "") {
    res.json({"error":"Id is missing"});
    return;
  }
  // searching for id so that we can use identifiers other than the index
  var userIndex = -1;
  for (var i = 0; i < users.length; i++) {
    if (users[i]._id == req.params._id) {
      userIndex = i;
    }
  }
  if (userIndex == -1) {
    res.json({"error":"No matching id found"});
    return;
  }
  else {
    req.params.index = userIndex;
    next();
  }
}

// helper function to generate randomised IDs for users
function generateId() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}