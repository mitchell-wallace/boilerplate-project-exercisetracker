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
  // searching for id so that we can use identifiers other than the index
  var userIndex;
  // var idInput = req.params._id;
  // var targetId = Number.parseInt(idInput);
  for (var i = 0; i < users.length; i++) {
    if (users[i]._id == req.params._id) {
      userIndex = i;
    }
  }

  // set up variables for new entry
  var description = req.body.description;
  var duration = parseInt(req.body.duration);
  var date;
  if (!req.body.date) date = new Date().toDateString();
  else date = new Date(req.body.date).toDateString();
    // date should be like "Sun Dec 10 2023"

  var newExercise = {
    'description': description,
    'duration': duration,
    'date': date
  };

  // if user has no log yet, create one
  // try {!users[userIndex].log;}
  // catch {users[userIndex].log = [];}
  if (!users[userIndex].log) users[userIndex].log = [];

  // add exercise to user's log and return
  users[userIndex].log.push(newExercise);
  res.json(users[userIndex]);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
