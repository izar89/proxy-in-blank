/* globals AudioContext */

var Util = require('../util/Util');
var Trigger = require('../svg/Trigger');
var BufferLoader = require('./BufferLoader');
var Player = require('./Player');
var sounds = require('../../data/sounds').sounds;

var bounds, triggers, svg, player, socket, buffer, min_duration, max_duration;

function Triggers() {
	_initSettings();
}

function _initSettings() {
	bounds = {
		width: window.innerWidth,
		height: window.innerHeight,
		border: 40
	};

	svg = document.querySelector('#triggers');
	triggers = [];

	var context = new AudioContext();
	player = new Player(context);

	min_duration = 18000;
	max_duration = 20000;

	var loader = new BufferLoader(context, sounds, _initSocket);
	loader.load();
}

function _initSocket(b) {
	buffer = b;
	socket = io('/');
	socket.addEventListener('add_trigger', _addTrigger);
	socket.addEventListener('trigger_played', _playSocketTrigger);
}

function _addTrigger(t) {
	var trigger = new Trigger(t);
	trigger.sound = buffer[(t.sound.id - 1)];
	trigger.panning = Util.getPanning(bounds, trigger.position.x);
	trigger.volume = Util.getVolume(bounds, trigger.position.y);
	trigger.element.addEventListener('mouseover', _triggerHandler, false);
	svg.appendChild(trigger.element);
	triggers.push(trigger);

	var duration = max_duration + t.sound.id / sounds.length * (min_duration - max_duration);
	var player = trigger.move(duration);

	player.onfinish = function() {
		svg.removeChild(trigger.element);
		triggers = _.reject(triggers, trigger);
	};
}

function _triggerHandler(e) {
	var curTrigger = _.findWhere(triggers, {
		'timestamp': parseInt(e.currentTarget.getAttribute('timestamp'))
	});
	curTrigger.play();
	player.play(curTrigger);

	socket.emit('play_trigger', curTrigger.timestamp);
}

function _playSocketTrigger(timestamp) {
	var curTrigger = _.findWhere(triggers, {
		'timestamp': timestamp
	});
	if (curTrigger) {
		curTrigger.play();
		player.play(curTrigger);
	}
}

Triggers.prototype.update = function() {
    for (var i = 0; i < triggers.length; i++) {
    	var curTrigger = triggers[i];
    	curTrigger.panning = Util.getPanning(bounds, curTrigger.element.getBoundingClientRect().left);
    }
};

module.exports = Triggers;