const express = require('express');
const error = require('../middleware/error');

module.exports = (app) => {
  app.use(express.json());
  app.use('/api/wine', require('./wine'));
  app.use('/api/person', require('./person'));
  app.use('/api/likes', require('./likes'));
  app.use(error);
};
