var SVGHelper = require('./SVGHelper');
var Util = require('../util/Util');

function Trigger(trigger) {
	this.position = trigger.position || {x: 0, y: 0};
	this.size = {width: 40, height: 40};
	this.fill = Util.randomHsla(); // random nice/bright color
	this.timestamp = trigger.timestamp;

	_create.call(this);
}

function _create() {
	this.element = SVGHelper.createElement('rect');
	this.element.setAttribute('x', this.position.x);
	this.element.setAttribute('y', this.position.y);
	this.element.setAttribute('width', this.size.width);
	this.element.setAttribute('height', this.size.height);
	this.element.setAttribute('fill', this.fill);
	this.element.setAttribute('timestamp', this.timestamp);
	this.element.setAttribute('stroke', this.fill);
	this.element.setAttribute('stroke-width', '0');
}

Trigger.prototype.play = function() {
	console.log('jow, playplay');
};

Trigger.prototype.moveTrigger = function(duration) {
    var player = this.element.animate([{
        transform: 'translateX(' + (this.position.x + window.innerWidth )+ 'px)'
    }, {
        transform: 'translateX(' + (this.position.x - 300) + 'px)'
    }], {
        duration: duration
    });

    return player;
};

module.exports = Trigger;
