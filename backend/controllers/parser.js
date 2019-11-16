'use strict';

const csvToJson = require('convert-csv-to-json');

const users = './datasets/users.csv';
const ratings = './datasets/ratings.csv';
const movies = './datasets/movies.csv';


var myUser = function (id, name) {
  this.id = id;
  this.name = name;
  this.ratings = [];
};

var myRating = function (movieId, rating) {
  this.movieId = movieId;
  this.rating = rating;
};

var myFilm = function (movieId, year) {
  this.movieId = movieId;
  this.year = year;
};

function parseUsers() {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(users);
  })();
};

function parseMovies() {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(movies);
  })();
};

function parseRaitings() {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(ratings);
  })();
};

exports.parseUsers = parseUsers();
exports.parseMovies = parseMovies();
exports.parseRaitings = parseRaitings();

exports.getUsersData = () => {
  return (async () => {
    let users = await parseUsers();
    let movies = await parseMovies();
    let ratings = await parseRaitings();

    let films = {};
    for (let i = 0; i < movies.length; i++) {
      let title = movies[i].Title;
      films[title] = new myFilm(movies[i].MovieId, movies[i].Year);
    }

    let persons = [];
    for (let i = 0; i < users.length; i++) {
      persons[i] = new myUser(users[i].UserId, users[i].Name);

      for (let k = 0; k < ratings.length; k++) {

        if (persons[i].id === ratings[k].UserId) {
          persons[i].ratings.push(new myRating(ratings[k].MovieId, ratings[k].Rating))
        }
      }
    }

    return persons;
  })();
};
