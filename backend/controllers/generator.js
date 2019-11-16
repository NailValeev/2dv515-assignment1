'use strict';

let parser = require('./parser');

exports.getAllUsersSimilarity = () => {
  return (async () => {

    let data = await parser.getUsersData();

    return getUsersSimilarity(data);
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

function getUsersSimilarity(allUsers) {

  if (!allUsers) return null;

  let result = [];

  for (let i = 0; i < allUsers.length; i++) {
    let currUser = allUsers[i];

    let infoHolder = new myInfoHolder(currUser.id, currUser.name);

    for (let j = 0; j < allUsers.length; j++) {
      let compUser = allUsers[j];

      if (currUser.id === compUser.id) {
        continue;
      }
      infoHolder.similarUsers.push(new myResult(compUser.name, compUser.id, getSimilarity(currUser, compUser)));
    }
    infoHolder.similarUsers.sort(function (a, b) { return a.score - b.score });

    result.push(infoHolder);
  }
  return result;
}

function getSimilarity(userA, userB) {
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
