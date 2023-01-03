const Project = require('../models/project');

const SharedService = require('../services/shared');
const UserService = require('../services/user');

const _getValidUsers = async (users) => {
  if (users && users.length) {
    let userProjects = await UserService.getUsersProject(users);

    if(typeof users === 'string'){
      userProjects = [userProjects];
    }
    return userProjects
      .filter((user) => user.isActive && !user.project)
      .map((user) => user._id);
  }
  return [];
}

const getAllProjects = async (query) => {
  if (query.name) {
      return await Project.find({
          name: { $regex: query.name, $options: 'i' }
      });
  }

  return await SharedService.all(Project);
};


const getProjectById = async (id) => {
  return await Project.findById(id)
    .populate('users')
    .populate('manager')
    .populate(
      { 
        path: 'tasks', 
        populate: { path: 'user' }
      });
}

const createProject = async (body) => {
  const { users, ...project } = body;

  const manager = await UserService.getUsersProject(project.manager);
  const validUsers = await _getValidUsers(users);

  if(!manager){
    throw new Error('Manager does not exist.');
  }

  if(!manager.isActive || manager.project){
    throw new Error(
      `Manager ${manager.firstName} ${manager.lastName} cannot be assigned to project.`
    );
  }

  return await SharedService.create(Project, {
    ...project,
    users: validUsers
  });
}

const updateProject = async (id, body) => {
  const { users, ...project } = body;

  let manager;
  let validUsers = [];

  if(project.manager){
    manager = await UserService.getUsersProject(project.manager);
    if(!manager){
      throw new Error(`Manager does not exist.`);
    }

    if(!manager.isActive || manager.project.id !== id) {
      throw new Error(
        `Manager ${manager.firstName} ${manager.lastName} cannot be assigned to project.`
      );
    }
  }
  if (users) {
    validUsers = await _getValidUsers(users);
  }
  return await Project.findByIdAndUpdate(
    id,
    {
      $set: { ...project },
      $addToSet: { users: validUsers }
    },
    { returnDocument: 'after' }
  );
}

const addProjectUser = async (id, user) => {
  await Project.findByIdAndUpdate(id, { $addToSet: { users: user } });
}

const removeProjectUser = async (user) => {
  return await Project.findOneAndUpdate(
    { users: { $in: user } },
    { $pull: { users: user } }
  );
}
module.exports = {
    _getValidUsers,
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    addProjectUser,
    removeProjectUser
};
