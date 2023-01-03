const router = require('express').Router();

const Project = require('../controllers/project');

router.get('/', Project.getProject);

router.post('/', Project.createProject);

router.get('/:id', Project.getProjectById);

router.put('/:id', Project.updateProject);



module.exports = router;
