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
function calculateSimilarityEuclidean (userA, userB) {
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

  if (matches === 0) {
    return 0;
  }

  return 1 / (1 + similarity);
}

/**
 *  @function
 *
 *  @returns Promise with all similarities for users calculated by Euclidean distance
 */
exports.getAllUsersSimilarityEuclidean = () => {
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
        infoHolder.similarUsers.push(new MyResult(compUser.name, compUser.id, calculateSimilarityEuclidean(currUser, compUser)));
      }
      infoHolder.similarUsers.sort(function (a, b) { return b.score - a.score });

      result.push(infoHolder);
    }
    return result;
  })()
}

// helper function
function calculateSimilarityPearson (userA, userB) {
  let sum1 = 0;
  let sum2 = 0;
  let sum1sq = 0;
  let sum2sq = 0;
  let pSum = 0;

  let matches = 0;

  for (let a = 0; a < userA.ratings.length; a++) {
    for (let b = 0; b < userB.ratings.length; b++) {
      if (userA.ratings[a].movieId === userB.ratings[b].movieId) {
        matches++ ;
        sum1 += Number(userA.ratings[a].rating) // sum of ratings for userA
        sum2 += Number(userB.ratings[b].rating) // sum of ratings for userB      
        sum1sq += Number(Math.pow(userA.ratings[a].rating, 2)) // sum of squared ratings for userA
        sum2sq += Number(Math.pow(userB.ratings[b].rating, 2)) // sum of squared ratings for userB
        pSum += Number(userA.ratings[a].rating) * Number(userB.ratings[b].rating) // product of ratings from userA and userB
      }
    }
  }

  if (matches === 0) {
    return 0;
  }

  // Calculate Pearson corellation
  let num = pSum - (sum1 * sum2 / matches);
  let den = Math.sqrt((sum1sq - Math.pow(sum1, 2) / matches) * (sum2sq - Math.pow(sum2, 2) / matches));

  let result = num / den; 

  return result ;
}

/**
 *  @function
 *
 *  @returns Promise with all similarities for users calculated by Euclidean distance
 */
exports.getAllUsersSimilarityPearson = () => {
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
        infoHolder.similarUsers.push(new MyResult(compUser.name, compUser.id, calculateSimilarityPearson(currUser, compUser)));
      }
      infoHolder.similarUsers.sort(function (a, b) { return b.score - a.score });

      result.push(infoHolder);
    }
    return result;
  })()
}