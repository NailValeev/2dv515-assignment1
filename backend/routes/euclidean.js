const router = require('express').Router();
let generator = require('../controllers/generator');

router.route('/').get((req, res) => {
  generator.getAllUsersSimilarityEuclidean()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.status(500).json('Error: ' + err));
});

module.exports = router;