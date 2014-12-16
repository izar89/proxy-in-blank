/* globals AudioContext */

var Util = require('../util/Util');
var Trigger = require('../svg/Trigger');
var BufferLoader = require('./BufferLoader');
var Player = require('./Player');
var sounds = require('../../data/sounds').sounds;
var settings = require('../../data/settings');

var bounds, triggers, svg, player, socket;

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
		var trigger = new Trigger(Util.randomPosition(bounds), {width: 40, height: 40}, i);
		trigger.sound = buffer[i];
		trigger.panning = Util.getPanning(bounds, trigger.position.x);
		trigger.volume = Util.getVolume(bounds, trigger.position.y);
		trigger.element.addEventListener('mouseover', _triggerHandler, false);
		svg.appendChild(trigger.element);
		triggers.push(trigger);
	}

	_initSocket();
}

function _triggerHandler(e) {
	var curTrigger = triggers[e.currentTarget.getAttribute('trigger')];
	player.play(curTrigger);

	socket.emit('trigger_play', triggers.indexOf(curTrigger));
}

function _initSocket() {
	socket = io(settings.server);
	socket.addEventListener('trigger_played', _playSocketTrigger);
}

function _playSocketTrigger(trigger) {
	console.log(trigger);
	player.play(triggers[trigger]);
}

module.exports = Triggers;