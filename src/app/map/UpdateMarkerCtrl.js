
var markerAdded = require('./MapComponents').markerAdded;
var changeMarker = require('./MapComponents').changeMarker;
var deleteMarker = require('./MapComponents').deleteMarker;

var emitter = require('../index').emitter;

emitter.on('addMarker', function () {
    console.log('addMarker working')
});
emitter.emit('addMarker1');
emitter.emit('addMarker2');
emitter.emit('addMarker3');

// markerAdded({ lat: 50.447458, lng: 30.525717}, 'Varenik`s', 'Restaurant', 'Excellent', '5', '67', '5');
