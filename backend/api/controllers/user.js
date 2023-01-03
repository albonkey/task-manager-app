const UserService = require('../services/user');

const getUsers = async (req, res) => {
  const { query } = req;

  try {
      const users = await UserService.getAllUsers(query);
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
}

const getUserById = async (req, res) => {
  const { id } = req.params;

  try{
    const user = await UserService.getUserById(id);
    res.json(user);
  } catch(error) {
    res.status(500).send({ error: error.toString() });
  }
}

const updateUser = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;

  try {
      const user = await UserService.updateUser(id, body);
      res.json(user);
  } catch (error) {
      res.status(500).send({ error: error.toString() });
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser
}
