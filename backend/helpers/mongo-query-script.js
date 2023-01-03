/* eslint-disable camelcase */
// Import the mongoose module
const mongoose = require('mongoose');

const Project = require('../api/models/project');
const Task = require('../api/models/task');
const User = require('../api/models/user');

const { username, password, dbName } = require('../config.json');
const URL = `mongodb+srv://${username}:${password}@${dbName}.rev0ghs.mongodb.net/?retryWrites=true&w=majority`;
mongoose
    .connect(URL)
    .then(() => console.log('Connected to Mongo'))
    .catch(() => console.log('Failed to Connect'));

const seedData = async () => {
    // clean Users collection
    await User.deleteMany({});

    // create some users
    const manager = await User.create({
      firstName: 'Carl',
      lastName: 'Solli',
      title: 'Software Engineer',
      isActive: true
    });

    const manager2 = await User.create({
      firstName: 'Simon',
      lastName: 'Johansen',
      title: 'Software Engineer',
      isActive: true
    });

    const user = await User.create({
      firstName: 'Jeppe',
      lastName: 'Paulsen',
      title: 'Software Engineer',
      isActive: true
    });

    const inactive_user = await User.create({
      firstName: 'Carl',
      lastName: 'Solli',
      title: 'Software Engineer',
      isActive: false
    });

    // clean Projects collection
    await Project.deleteMany({});

    // create some projects with VALID relationships
    // associate a user or users to the project because they are not associated to any other project
    const project = await Project.create({
      name: 'Project I',
      description: 'This is the first project of its kind.',
      repository: '...',
      manager: manager._id,
      users: [manager._id, user._id]
    });

    const project_two = await Project.create({
      name: 'Project II',
      description: 'This is the second project of its kind.',
      repository: '...',
      manager: manager2._id,
      users: [manager2._id, inactive_user._id]
    });

    // clean the Tasks collection
    await Task.deleteMany({});

    // create some Tasks with VALID relationships
    // associate a project to the task
    // associate a user to the task because that user is associated to the project
    const task_one = await Task.create({
      name: 'Setup project',
      details: 'Initalize the Vue project, and get it ready for development.',
      priority: 'high',
      status: 'in progress',
      timeline: {
        assigned: '2022-12-1',
        due: '2022-12-23',
        last_updated: '2022-12-1',
      },
      user: manager._id,
      project: project._id
    });

    const task_two = await Task.create({
      name: 'Design frontend',
      details: 'Design the frontend for the application.',
      priority: 'high',
      status: 'in progress',
      timeline: {
        assigned: '2022-12-1',
        due: '2022-12-23',
        last_updated: '2022-12-1',
      },
      user: user._id,
      project: project._id
    });

    const task_three = await Task.create({
      name: 'Create components',
      details: 'Start creating the components for the project.',
      priority: 'high',
      status: 'in progress',
      timeline: {
        assigned: '2022-12-12',
        due: '2022-12-31',
        last_updated: '2022-12-12',
      },
      user: user._id,
      project: project._id
    });
};
//seedData();

const runQueries = async () => {
    const user = await User.findById('638fab0c599a6d7331c4fec4')
    console.log('USER');
    console.log(JSON.stringify(user, null, 2));

    const taskDetails = await Task.findById('638fab10599a6d7331c4fed2')
        .populate('project', 'name description')
        .populate('user');

    console.log('TASK');
    console.log(taskDetails);
    console.log(JSON.stringify(taskDetails, null, 2));

    const projectDetail = await Project.findById('638fab0f599a6d7331c4fecd')
        .populate('manager')
        .populate('tasks', 'name details status');

    console.log('PROJECT');
    console.log(JSON.stringify(projectDetail, null, 2));

    mongoose.connection.close();
};
runQueries();
