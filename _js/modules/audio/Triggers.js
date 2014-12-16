var Util = require('../util/Util');
var Trigger = require('../svg/Trigger');
var BufferLoader = require('./BufferLoader');
var Player = require('./Player');
var sounds = require('../../data/sounds').sounds;

var bounds, triggers, svg, player, currentHit;

function Triggers() {
	_initSettings();
}

function _initSettings() {
	bounds = {
		width: window.innerWidth,
		height: window.innerHeight,
		border: 40
	};

	svg = document.querySelector('svg');
	triggers = [];

	var context = new AudioContext();
	player = new Player(context);

	var loader = new BufferLoader(context, sounds, _createTriggers);
	loader.load();
}

function _createTriggers(buffer) {
	for(var i = 0; i < buffer.length; i++) {
		var trigger = new Trigger(Util.randomPosition(bounds), {width: 40, height: 40});
		trigger.sound = buffer[i];
		trigger.panning = Util.getPanning(bounds, trigger.position.x);
		trigger.volume = Util.getVolume(bounds, trigger.position.y);
		svg.appendChild(trigger.element);
		triggers.push(trigger);
	}
}

Triggers.prototype.hitTest = function(e) {
	for(var i = 0; i < triggers.length; i++) {
		if(Util.hitTest({x: e.pageX, y: e.pageY}, triggers[i].element.getBBox())) {
			if(currentHit !== triggers[i]) {
				currentHit = triggers[i];
				player.play(currentHit);
			}
		}
	}
};

module.exports = Triggers;