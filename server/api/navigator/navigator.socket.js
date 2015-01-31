/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Navigator = require('./navigator.model');

exports.register = function(socket) {
  Navigator.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Navigator.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('navigator:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('navigator:remove', doc);
}