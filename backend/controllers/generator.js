'use strict';

let parser = require('./parser');

exports.getEuclidian = (user) => {
  return (async () => {
    let data = await parser.getData();

    data.filter(elem => elem.id === user);
    return JSON.stringify(data);
  })();
};
