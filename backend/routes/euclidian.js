const router = require('express').Router();
let generator = require('../controllers/generator');

router.route('/').get((req, res) => {
  generator.getUsers()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;