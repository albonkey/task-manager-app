const router = require('express').Router();
const User = require('../controllers/user.js');

router.get('/', User.getUsers);

router.get('/:id', User.getUserById);

router.put('/:id', User.updateUser);

module.exports = router;
