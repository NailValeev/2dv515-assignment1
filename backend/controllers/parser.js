'use strict';

const csvToJson = require('convert-csv-to-json');

const users = './datasets/users.csv';
const ratings = './data/ratings.csv';
const movies = './data/movies.csv';

exports.parseUsers = () => {
  return (async () => {
      return await csvToJson.fieldDelimiter(';').getJsonFromCsv(users);
    })();
};
