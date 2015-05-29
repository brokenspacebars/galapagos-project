/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sailboat = require('./sailboat.model');

exports.register = function(socket) {
  Sailboat.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sailboat.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sailboat:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sailboat:remove', doc);
}