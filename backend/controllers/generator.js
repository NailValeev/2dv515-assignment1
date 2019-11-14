'use strict';

let parser = require('./parser');

exports.getUsers = () => {
  return (async () => {
    return await parser.parseUsers();
  })();
};
