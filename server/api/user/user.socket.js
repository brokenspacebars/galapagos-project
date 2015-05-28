/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var user = require('./user.model');

exports.register = function(socket) {
  user.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  user.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
  user.schema.post('update', function (doc) {
    onUpdate(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  console.log('emitting user:save');
  socket.emit('user:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('user:remove', doc);
}

function onUpdate(socket, doc, cb) {
  console.log('emitting user:update');
	socket.emit('user:update', doc)
}