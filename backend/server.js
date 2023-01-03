const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const { username, password, dbName } = require('./config.json');

const app = express();
const port = 8888;


const userId = '635cb12e651c22ee712fa7b6';
const taskId = '635cbb90651c22ee712fa7b9';
const projectId = '635cc143651c22ee712fa7bc';

// require in our route resource
const users = require('./api/routes/users');
const projects = require('./api/routes/projects');
const tasks = require('./api/routes/tasks');

// apply our cors middleware
app.use(cors());

// middleware to parse POST/PUT bodies in express
app.use(express.json());

// add resource route to our express application
app.use('/users', users);
app.use('/projects', projects);
app.use('/tasks', tasks);

// start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

const mongoURL = `mongodb+srv://${username}:${password}@${dbName}.rev0ghs.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, () => {
    console.log('Connected to Mongo');
});
