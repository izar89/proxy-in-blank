/* globals AudioContext */

var Util = require('../util/Util');
var Trigger = require('../svg/Trigger');
var BufferLoader = require('./BufferLoader');
var Player = require('./Player');
var sounds = require('../../data/sounds').sounds;
var settings = require('../../data/settings');

var bounds, triggers, svg, player, socket, buffer, min_duration, max_duration, currentTime;

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

    min_duration = 30000;
    max_duration = 42000;

    var loader = new BufferLoader(context, sounds, _initSocket);
    loader.load();
}

function _initSocket(b) {
    buffer = b;
    socket = io(settings.server);
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


        trigger.element.setAttribute('trigger', triggers.indexOf(trigger));
    setTimeout(function() {
    	svg.removeChild(trigger.element);
    	triggers = _.reject(triggers, trigger);
    }, 30000);


/*    var duration = max_duration + t.sound.id / sounds.length * (min_duration - max_duration);
    var player = trigger.element.animate([{
        transform: 'translate(0px, ' + trigger.position.y + 'px)'
    }], {
        duration: duration,
        iterations: Infinity
    });

    player.onfinish = function(e) {
        console.log('per aspera ad terra!');
    };*/
}

function _triggerHandler(e) {
    var curTrigger = _.findWhere(triggers, {
        'timestamp': parseInt(e.currentTarget.getAttribute('timestamp'))
    });
    player.play(curTrigger);

    socket.emit('play_trigger', curTrigger.timestamp);
}

function _playSocketTrigger(timestamp) {
    var curTrigger = _.findWhere(triggers, {
        'timestamp': timestamp
    });
    if (curTrigger) {
        player.play(curTrigger);
    }
}

Triggers.prototype.update = function() {
	for(var i = 0; i < triggers.length; i++) {
		var curTrigger = triggers[i];
		curTrigger.moveTrigger(curTrigger.position.x - 1, curTrigger.position.y);
		curTrigger.panning = Util.getPanning(bounds, curTrigger.position.x);
	}
};

Triggers.prototype.play = function() {
	if(currentTime) {
		var diff = Math.round((parseInt(Date.now()) - currentTime) / 60);
		console.log(diff);
		for(var i = 0; i < triggers.length; i++) {
			var curTrigger = triggers[i];
			curTrigger.moveTrigger(curTrigger.position.x - diff, curTrigger.position.y);
			curTrigger.panning = Util.getPanning(bounds, curTrigger.position.x);
		}
	}
	currentTime = 0;
};

Triggers.prototype.pause = function() {
	currentTime = Date.now();
};

module.exports = Triggers;