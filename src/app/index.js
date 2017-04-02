'use strict';

var Emitter = require('component-emitter');
var emitter = new Emitter;
module.exports.emitter = emitter;
require('./map');