'use strict';
// import
let parser = require('./parser');

// object declaration
var MyInfoHolder = function (id, name) {
  this.id = id;
  this.uid = id + ': ' + name;
  this.similarUsers = [];
  this.recommendations = [];
}

function MyResult (resultName, resultId, score) {
  this.resultName = resultName;
  this.resultId = resultId;
  this.score = score;
}

var MyMovie = function (movieId, title, year ) {
  this.movieId = movieId;
  this.description = title + " (" + year + ")";
  this.movieRating = 0; // Initial, set it later
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
function getAllUsersSimilarityEuclidean () {
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
function getAllUsersSimilarityPearson () {
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

// helper functions
function getMovieRatingByIdAndUSerId (userId, movieId, ratingSet) {
  let rating = 0;
  for (let i = 0; i < ratingSet.length; i++ ) {
    if (movieId === ratingSet[i].MovieId && userId === ratingSet[i].UserId) {
      rating = ratingSet[i].Rating;
    }
  }
  return rating;
}

function userHasRatingForMovie (userId, movieId, ratingSet) {
  for (let i = 0; i < ratingSet.length; i++ ) {
    if (movieId === ratingSet[i].MovieId && userId === ratingSet[i].UserId) {
      return true;
    }
  }
  return false;
}

/**
 *  @function
 *  Enrich with recommendations existing data set that contains similarity
 *
 *  @returns Promise with all similarities for users calculated by Euclidean distance
 */
function getAllUsersSimilarityAndRecommendationsEuclidean () {
  return (async () => {
    let movies = await parser.parseMovies;
    let ratings = await parser.getRaitings();

    let dataSet = await getAllUsersSimilarityEuclidean();
    for (let s = 0; s < dataSet.length; s++ ) {
      let similarities = dataSet[s].similarUsers;

      // set all movies with initial rating 0
      for (let m = 0; m < movies.length; m++) {
        let movieId = movies[m].MovieId;
        let movie = new MyMovie(movieId, movies[m].Title, movies[m].Year);

        let movieScoreSum = 0;
        let similarityNumber = 0;

        for (let i = 0; i < similarities.length; i++ ) {
          let similarityScore = similarities[i].score;       
          if (similarityScore <= 0) continue;

          let userId = similarities[i].resultId;

          if (userHasRatingForMovie(userId, movieId, ratings)) {
            similarityNumber += similarityScore;
            movieScoreSum += similarityScore * getMovieRatingByIdAndUSerId(userId, movieId, ratings);
          }
        }

        if (similarityNumber === 0) {
          movie.movieRating = 0
        } else {
          movie.movieRating = movieScoreSum / similarityNumber;
        }

        if (!userHasRatingForMovie(dataSet[s].id, movieId, ratings)) {
          dataSet[s].recommendations.push(movie);
        }

      } // movie set for user generated
      dataSet[s].recommendations.sort(function (a, b) { return Number(b.movieRating) - Number(a.movieRating) });
    }
    return dataSet;
  })()
}
/**
 *  @function
 *  Enrich with recommendations existing data set that contains similarity
 *
 *  @returns Promise with all similarities for users calculated by Pearson similarity
 */
function getAllUsersSimilarityAndRecommendationsPearson () {
  return (async () => {
    let movies = await parser.parseMovies;
    let ratings = await parser.getRaitings();

    let dataSet = await getAllUsersSimilarityPearson();
    for (let s = 0; s < dataSet.length; s++ ) {
      let similarities = dataSet[s].similarUsers;

      // set all movies with initial rating 0
      for (let m = 0; m < movies.length; m++) {
        let movieId = movies[m].MovieId;
        let movie = new MyMovie(movieId, movies[m].Title, movies[m].Year);

        let movieScoreSum = 0;
        let similarityNumber = 0;

        for (let i = 0; i < similarities.length; i++ ) {
          let similarityScore = similarities[i].score;       
          if (similarityScore <= 0) continue;

          let userId = similarities[i].resultId;

          if (userHasRatingForMovie(userId, movieId, ratings)) {
            similarityNumber += similarityScore;
            movieScoreSum += similarityScore * getMovieRatingByIdAndUSerId(userId, movieId, ratings);
          }
        }

        if (similarityNumber === 0) {
          movie.movieRating = 0
        } else {
          movie.movieRating = movieScoreSum / similarityNumber;
        }

        dataSet[s].recommendations.push(movie); // TODO sort
      } // movie set for user generated
      dataSet[s].recommendations.sort(function (a, b) { return Number(b.movieRating) - Number(a.movieRating) });
    }
    return dataSet;
  })()
}

exports.getAllUsersSimilarityEuclidean = getAllUsersSimilarityEuclidean();
exports.getAllUsersSimilarityPearson = getAllUsersSimilarityPearson();
exports.getAllUsersSimilarityAndRecommendationsEuclidean = getAllUsersSimilarityAndRecommendationsEuclidean();
exports.getAllUsersSimilarityAndRecommendationsPearson = getAllUsersSimilarityAndRecommendationsPearson();
