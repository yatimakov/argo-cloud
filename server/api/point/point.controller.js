'use strict';

var _ = require('lodash');
var Point = require('./point.model');

// Get list of points
exports.index = function (req, res) {
  //console.error(req.query.dateFrom);
  //console.error(req.query.navigatorID);
  var findCriteria = {};
  if ((req.query.dateFrom != undefined) || (req.query.dateTo != undefined)) {
    findCriteria.date = {};
  }


  if (req.query.dateFrom != undefined) {
    findCriteria.date.$gte = new Date(req.query.dateFrom);
  }
  if (req.query.dateTo != undefined) {
    findCriteria.date.$lt = new Date(req.query.dateTo);
  }
  if (req.query.navigatorID != undefined) {
    findCriteria.navigatorID = req.query.navigatorID
  }

  console.log(findCriteria);

  Point.find(findCriteria, function (err, points) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, points);
  });
};

// Get a single point
exports.show = function (req, res) {
  Point.findById(req.params.id, function (err, point) {
    if (err) {
      return handleError(res, err);
    }
    if (!point) {
      return res.send(404);
    }
    return res.json(point);
  });
};

// Creates a new point in the DB.
exports.create = function (req, res) {
  Point.create(req.body, function (err, point) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, point);
  });
};

// Updates an existing point in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Point.findById(req.params.id, function (err, point) {
    if (err) {
      return handleError(res, err);
    }
    if (!point) {
      return res.send(404);
    }
    var updated = _.merge(point, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, point);
    });
  });
};

// Deletes a point from the DB.
exports.destroy = function (req, res) {
  Point.findById(req.params.id, function (err, point) {
    if (err) {
      return handleError(res, err);
    }
    if (!point) {
      return res.send(404);
    }
    point.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
