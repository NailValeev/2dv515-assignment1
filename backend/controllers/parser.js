'use strict';

const csvToJson = require('convert-csv-to-json');

const users = './datasets/users.csv';
const ratings = './datasets/ratings.csv';
const movies = './datasets/movies.csv';

exports.parseUsers = () => {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(users);
  })();
};

exports.parseMovies = () => {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(movies);
  })();
};

exports.parseRaitings = () => {
  return (async () => {
    return csvToJson.fieldDelimiter(';').getJsonFromCsv(ratings);
  })();
};
