'use strict';

let parser = require('./parser');

exports.getEuclidian = (user) => {
  return (async () => {
    let users = await parser.parseUsers();
    let movies = await parser.parseMovies();
    let ratings = await parser.parseRaitings();

    return movies;
  })();
};
