const ProjectService = require('../services/project');

const getProject = async(req, res) => {
  const { query } = req;

  try {
    const projects = await ProjectService.getAllProjects(query);
    res.json(projects);
  } catch (error) {
      res.status(500).send({ error: error.toString() });
  }
}

const getProjectById = async (req, res) => {
  const { id } = req.params;

  try{
    const project = await ProjectService.getProjectById(id);
    res.json(project);
  } catch(error) {
    res.status(500).send({ error: error.toString() });
  }
}

const createProject = async (req, res) => {
  const { body } = req;

  try{
    const project = await ProjectService.createProject(body);
    res.json(project);
  } catch (error) {
      res.status(500).send({ error: error.toString() });
  }
}

const updateProject = async (req, res) => {
    const {
        body,
        params: { id }
    } = req;

    try {
        const project = await ProjectService.updateProject(id, body);
        res.json(project);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};
module.exports = {
    getProject,
    getProjectById,
    createProject,
    updateProject
};
