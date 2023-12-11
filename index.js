const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

// const exercises = [];
  // String username
  // String description
  // Number duration
  // Date date
  // String _id

const users = [];
  // String username
  // String _id
  // [] log

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// creates 1 new user and returns this user's username and _id
// the user will not have a log at the point of creation
app.post('/api/users', (req, res) => {
  var newUser = {
    'username': req.body.username,
    '_id': users.length
    }
  users.push(newUser);
  res.json(newUser);
});

// returns all users in array
// TODO: hide log in these --> I think I've fixed this using Poe Assistant
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

// creates 1 new exercise for user matching _id
app.post('/api/users/:_id/exercises', (req, res) => {

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

  // validate and set variables for remaining inputs
  // 1 - description
  if (!req.body.description || req.body.description == "") {
    res.json({"error":"Description is missing"});
    return;
  }
  var description = req.body.description;

  // 2 - duration
  if (!req.body.duration || isNaN(req.body.duration)) {
    res.json({"error":"Duration is not a number or is missing"});
    return;
  }
  var duration = parseInt(req.body.duration);

  // 3 - date
  var date;
  if (!req.body.date) date = new Date().toDateString();
  else date = new Date(req.body.date).toDateString();
  if (date.toString() == "Invalid Date") {
    res.json({"error":"Invalid date supplied"});
    return;
  }

  var newExercise = {
    'description': description,
    'duration': duration,
    'date': date
  };

  // if user has no log yet, create one
  if (!users[userIndex].log) users[userIndex].log = [];

  // add exercise to user's log and return
  users[userIndex].log.push(newExercise);
  res.json(users[userIndex]);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
