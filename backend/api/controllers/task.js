const TaskService = require('../services/task');

const getTaskById = async (req, res) => {
  const { id } = req.params;

  try{
    const task = await TaskService.getTaskById(id);
    res.json(task);
  } catch(error) {
    res.status(500).send({ error: error.toString() });
  }
}

const createTask = async (req, res) => {
  const { body } = req;

  try{
    const task = await TaskService.createTask(body);
    res.json(task);
  } catch (error) {
      res.status(500).send({ error: error.toString() });
  }
}

const updateTask = async (req, res) => {
  const {
      body,
      params: { id }
  } = req;

  try {
      const task = await TaskService.updateTask(id, body);
      res.json(task);
  } catch (error) {
      res.status(500).send({ error: error.toString() });
  }
}
const removeTask = async (req, res) => {
  const { id } = req.params;

  try {
      const task = await TaskService.removeTask(id);
      res.json({deleted: task });
  } catch (error) {
      res.status(500).send({ error: error.toString() });
  }
}

module.exports = {
  getTaskById,
  createTask,
  updateTask,
  removeTask
}
