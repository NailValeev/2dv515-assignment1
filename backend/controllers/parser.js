'use strict';
// imports
const csvToJson = require('convert-csv-to-json');

const users = './datasets/users.csv';
const ratings = './datasets/ratings.csv';
const movies = './datasets/movies.csv';

// object declaration
var MyUser = function (id, name) {
  this.id = id;
  this.name = name;
  this.ratings = [];
}

var MyRating = function (movieId, rating) {
  this.movieId = movieId;
  this.rating = rating;
}

// helper functions
function parseUsers () {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(users);
  })()
};

function parseMovies () {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(movies);
  })()
};

function parseRaitings () {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(ratings);
  })()
};

exports.parseUsers = parseUsers();
exports.parseMovies = parseMovies();
exports.parseRaitings = parseRaitings();

/**
 *  @function
 *
 *  @returns Promise with consolidated data arranged by user
 */
exports.getUsersData = () => {
  return (async () => {
    let users = await parseUsers();
    let ratings = await parseRaitings();

    let persons = [];
    for (let i = 0; i < users.length; i++) {
      persons[i] = new MyUser(users[i].UserId, users[i].Name);

      for (let k = 0; k < ratings.length; k++) {

        if (persons[i].id === ratings[k].UserId) {
          persons[i].ratings.push(new MyRating(ratings[k].MovieId, ratings[k].Rating))
        }
      }
    }

    return persons;
  })()
}
