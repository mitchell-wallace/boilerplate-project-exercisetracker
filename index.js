const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

const exercises = [];
  // String username
  // String description
  // Number duration
  // Date date
  // String _id

const users = [];
  // String username
  // String _id

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// creates 1 new user and returns this user's username and _id
app.post('/api/users', (req, res) => {
  var newUser = {
    'username': req.body.username,
    '_id': users.length
    }
  users.push(newUser);
  res.json(newUser);
});

// returns all users in array
app.get('/api/users', (req, res) => {
  res.json(users);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
