'use strict';

var _ = require('lodash');
var Sailboat = require('./sailboat.model');

// Get list of sailboats
exports.index = function(req, res) {
  Sailboat.find(function (err, sailboats) {
    if(err) { return handleError(res, err); }
    return res.json(200, sailboats);
  });
};

// Get a single sailboat
exports.show = function(req, res) {
  Sailboat.findById(req.params.id, function (err, sailboat) {
    if(err) { return handleError(res, err); }
    if(!sailboat) { return res.send(404); }
    return res.json(sailboat);
  });
};

// Creates a new sailboat in the DB.
exports.create = function(req, res) {
  console.log(req.user.name);
  console.log('------');
  console.log(req.user._id);
  console.log('------');
  console.log(req.body);
  console.log('------');
  // Add creator's _id on the sailboat
  req.body._creator = req.user._id;
  Sailboat.create(req.body, function(err, sailboat) {
    if(err) { return handleError(res, err); }
    // sailboat._creator = req.user._id;
    console.log(sailboat);
    return res.json(201, sailboat);
  });
};

// Updates an existing sailboat in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sailboat.findById(req.params.id, function (err, sailboat) {
    if (err) { return handleError(res, err); }
    if(!sailboat) { return res.send(404); }
    var updated = _.merge(sailboat, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sailboat);
    });
  });
};

// Deletes a sailboat from the DB.
exports.destroy = function(req, res) {
  Sailboat.findById(req.params.id, function (err, sailboat) {
    if(err) { return handleError(res, err); }
    if(!sailboat) { return res.send(404); }
    sailboat.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.showCreatorBoats = function(req, res) {
  Sailboat.find({ _creator: req.params.creator})
    .exec(function(err, sailboats) {
      if (err) return handleError(res, err);
      return res.json(200, sailboats);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}

function checkUser(req) {
  if (req.user._id === req.sailboat._creator) {
    return true;
  } else {
    return false;
  }
}