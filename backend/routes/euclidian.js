const router = require('express').Router();
let generator = require('../controllers/generator');

router.route('/').get((req, res) => {
  generator.getAllUsersSimilarity()
    .then(users => {

      for (let i = 0; i < users.length; i++) {
        console.log(users[i]);
      }
      res.json(users)
    })
    .catch(err => res.status(500).json('Error: ' + err));
});

module.exports = router;