const Task = require('../models/task');

const SharedService = require('../services/shared');
const ProjectService = require('../services/project');
const UserService = require('../services/user');

const getAllTasks = async () => await SharedService.all(Task);

const getTaskById = async (id) => await SharedService.getPopulated(Task, id, ['user', 'project']);

const createTask = async (body) => {
  const user = await UserService.getUsersProject(body.user);

  if (!user.isActive) {
    throw new Error(`User ${user.firstName} ${user.lastName} is not active.`);
  }
  if (
    user.project &&
    user.project._id.toString() !== body.project.toString()
  ) {
    throw new Error(
      `User ${user.firstName} ${user.lastName} already assigned to project ${user.project.name}`
    )
  }

  if (!user.project && body.user) {
    await ProjectService.addProjectUser(body.project, body.user);
  }
  return await SharedService.create(Task, body)
};

const updateTask = async (id, body) => {
  const task = await Task.findById(id);

  if(!task) {
    throw new Error(`Task with ${id} not found.`);
  }
  const user = await UserService.getUsersProject(body.user || task.user);
  const projectId = body.project || task.project;

  if(!user.isActive) {
    throw new Error(`User ${user.first} ${user.last} is not active.`);
  }

  if (user.project && user.project._id.toString() !== projectId.toString()) {
    throw new Error(
      `User ${user.firstName} ${user.lastName} already assigned to project ${user.project.name}`
    )
  }

  const updateTask = task.status === 'assigned' ? body: { status: body.status };

  if (!user.project && updateTask.user) {
    await ProjectService.addProjectUser(projectId, updateTask.user);
  }


  return await Task.findByIdAndUpdate({ _id: id}, updateTask, {
    returnDocument: 'after',
    runValidators: true
  });
}
const removeTask = async (id) => await SharedService.remove(Task, id);

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    removeTask
};
