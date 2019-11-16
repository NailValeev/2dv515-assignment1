'use strict';

const csvToJson = require('convert-csv-to-json');

const users = './datasets/users.csv';
const ratings = './datasets/ratings.csv';
const movies = './datasets/movies.csv';


var myPerson = function (id) {
  this.id = id;
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

exports.getData = () => {
  return (async () => {
    let users = await parseUsers();
    let movies = await parseMovies();
    let ratings = await parseRaitings();

    let films = {};
    for (let i = 0; i < movies.length; i++) {
      let title = movies[i].Title;
      films[title] = new myFilm(movies[i].MovieId, movies[i].Year);
    }

    let persons = {};
    for (let i = 0; i < users.length; i++) {
      let name = users[i].Name;
      persons[name] = new myPerson(users[i].UserId);

      let person = persons[name];
      for (let i = 0; i < ratings.length; i++) {

        if (person.id === ratings[i].UserId) {
          person.ratings.push(new myRating(ratings[i].MovieId, ratings[i].Rating))
        }
      }
    }

    return JSON.stringify(persons);
  })();
};
