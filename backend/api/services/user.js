const {
  Types: { ObjectId }
} = require('mongoose');

const User = require('../models/user');

const SharedService = require('../services/shared');

const getAllUsers = async (query) => {
  if (query.isActive) {
    const isActive = query.isActive ==='true';
    return await User.find({ isActive });
  }

  if (query.project) {
    const orMatch = [{ project: { $exists: false } }];
    
    if (query.project !== 'null') {
      orMatch.push({
        'project._id': {
          $eq: ObjectId(query.project)
        }
      });
    }
    return await User.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: 'projects',
          foreignField: 'users',
          localField: '_id',
          as: 'project'
        }
      },
      {
        $unwind: {
          path: '$project',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: orMatch
        }
      }
    ])
  }

  return await SharedService.all(User);
}

const getUserById = async (id) => await SharedService.get(User, id);

const updateUser = async (id, body) => {
  const ProjectService = require('../services/project');
  const TaskService = require('../services/task');

  if (!body.isActive) {
    await TaskService.removeTaskUser(id);
    await ProjectService.removeProjectUser(id);
  }
  return await SharedService.update(User, id, body);
}

const getUsersProject = async (users) => {
  if (users instanceof Array){
    return await User.find({ _id: users }).populate('project', 'name');
  } else {
    return await User.findOne({ _id: users }).populate('project', 'name');
  }
}
module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    getUsersProject
};
