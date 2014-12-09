var Util = require('../util/Util');
var Trigger = require('../svg/Trigger');

var bounds, triggers, svg;

function Triggers() {
	_initSettings();
	_createTriggers(8);
}

function _initSettings() {
	bounds = {
		width: window.innerWidth,
		height: window.innerHeight,
		border: 40
	};

	svg = document.querySelector('svg');
	console.log(svg);
	triggers = [];
}

function _createTriggers(amount) {
	for(var i = 0; i < amount; i++) {
		var trigger = new Trigger(Util.randomPosition(bounds), {width: 40, height: 40});
		svg.appendChild(trigger.element);
		triggers.push(trigger);
	}
}

Triggers.prototype.hitTest = function(e) {
	for(var i = 0; i < triggers.length; i++) {
		if(Util.hitTest({x: e.pageX, y: e.pageY}, triggers[i].element.getBBox())) {
			console.log('Hit!');
		}
	}
};

module.exports = Triggers;