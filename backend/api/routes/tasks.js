const router = require('express').Router();

const Task = require('../controllers/task');

router.post('/', Task.createTask);

router.get('/:id', Task.getTaskById);

router.put('/:id', Task.updateTask);

router.delete('/:id', Task.removeTask);


module.exports = router;
