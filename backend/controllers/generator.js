'use strict';

let parser = require('./parser');

exports.getAllUsersSimilarity = () => {
  return (async () => {

    let data = await parser.getUsersData();

    if (!data) return null;

    let result = [];

    for (let i = 0; i < data.length; i++) {
      let currUser = data[i];

      let infoHolder = new myInfoHolder(currUser.id, currUser.name);

      for (let j = 0; j < data.length; j++) {
        let compUser = data[j];

        if (currUser.id === compUser.id) {
          continue;
        }
        infoHolder.similarUsers.push(new myResult(compUser.name, compUser.id, getSimilarity(currUser, compUser)));
      }
      infoHolder.similarUsers.sort(function (a, b) { return a.score - b.score });

      result.push(infoHolder);
    }
    return result;

  })();
};


var myInfoHolder = function (id, name) {
  this.uid = id + ": " + name;
  this.similarUsers = []; // TODO sort descend
};

function myResult(resultName, resultId, score) {
  this.resultName = resultName;
  this.resultId = resultId;
  this.score = score;
}

function getSimilarity(userA, userB) {
  let similarity = 0;
  let matches = 0;

  for (let a = 0; a < userA.ratings.length; a++) {
    console.log("AAAAA compare  for user: " + userA.name)
    for (let b = 0; b < userB.ratings.length; b++) {
      console.log("FFFFF compare : " + a + "," + userA.ratings[a].movieId + " and " + b + ", " + userB.ratings[b].movieId)
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
