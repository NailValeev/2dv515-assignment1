'use strict';
// import
let parser = require('./parser');

// object declaration
var MyInfoHolder = function (id, name) {
  this.uid = id + ': ' + name;
  this.similarUsers = []; // TODO sort descend
}

function MyResult (resultName, resultId, score) {
  this.resultName = resultName;
  this.resultId = resultId;
  this.score = score;
}

// helper function
function calculateSimilarity (userA, userB) {
  let similarity = 0;
  let matches = 0;

  for (let a = 0; a < userA.ratings.length; a++) {
    for (let b = 0; b < userB.ratings.length; b++) {
      if (userA.ratings[a].movieId === userB.ratings[b].movieId) {
        matches++;
        similarity += Math.pow((userA.ratings[a].rating - userB.ratings[b].rating), 2);
      }
    }
  }

  if (matches == 0) {
    return 0;
  }

  return 1 / (1 + similarity);
}

/**
 *  @function
 *
 *  @returns Promise with all similarities for users calculated by Euclidean distance
 */
exports.getAllUsersSimilarity = () => {
  return (async () => {

    let data = await parser.getUsersData();

    if (!data) return null;

    let result = [];

    for (let i = 0; i < data.length; i++) {
      let currUser = data[i];

      let infoHolder = new MyInfoHolder(currUser.id, currUser.name);

      for (let j = 0; j < data.length; j++) {
        let compUser = data[j];

        if (currUser.id === compUser.id) {
          continue;
        }
        infoHolder.similarUsers.push(new MyResult(compUser.name, compUser.id, calculateSimilarity(currUser, compUser)));
      }
      infoHolder.similarUsers.sort(function (a, b) { return b.score - a.score });

      result.push(infoHolder);
    }
    return result;
  })()
}
