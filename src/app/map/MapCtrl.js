var Emitter = require('../index').Emitter;
var emitter = new Emitter;
var markerAdded = require('./MapComponents').markerAdded;
var changeMarker = require('./MapComponents').changeMarker;
var deleteMarker = require('./MapComponents').deleteMarker;

emitter.on('addNewMarker', function () {
    console.log('addMarker working')
});

// emitter.emit('addNewMarker3');
// emitter.emit('addMarker2');

// emitter.on('addNewMarker3', function () {
//     console.log('addMarker3 working')
// });

// markerAdded({ lat: 50.447458, lng: 30.525717}, 'Varenik`s', 'Restaurant', 'Excellent', '5', '67', '5');
module.exports.emitter = emitter;