/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Point = require('./point.model');

exports.register = function(socket) {
  Point.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Point.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('point:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('point:remove', doc);
}