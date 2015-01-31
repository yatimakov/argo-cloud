'use strict';

var _ = require('lodash');
var Navigator = require('./navigator.model');

// Get list of navigators
exports.index = function(req, res) {
  Navigator.find(function (err, navigators) {
    if(err) { return handleError(res, err); }
    return res.json(200, navigators);
  });
};

// Get a single navigator
exports.show = function(req, res) {
  Navigator.findById(req.params.id, function (err, navigator) {
    if(err) { return handleError(res, err); }
    if(!navigator) { return res.send(404); }
    return res.json(navigator);
  });
};

// Creates a new navigator in the DB.
exports.create = function(req, res) {
  Navigator.create(req.body, function(err, navigator) {
    if(err) { return handleError(res, err); }
    return res.json(201, navigator);
  });
};

// Updates an existing navigator in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Navigator.findById(req.params.id, function (err, navigator) {
    if (err) { return handleError(res, err); }
    if(!navigator) { return res.send(404); }
    var updated = _.merge(navigator, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, navigator);
    });
  });
};

// Deletes a navigator from the DB.
exports.destroy = function(req, res) {
  Navigator.findById(req.params.id, function (err, navigator) {
    if(err) { return handleError(res, err); }
    if(!navigator) { return res.send(404); }
    navigator.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}