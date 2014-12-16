var SVGHelper = require('./SVGHelper');
var Util = require('../util/Util');

function Trigger(position, size, triggerRef) {
	this.position = position || {x: 0, y: 0};
	this.size = size || {width: 40, height: 40};
	this.fill = Util.randomHsla(); // random nice/bright color
	this.triggerRef = triggerRef;

	_create.call(this);
}

function _create() {
	this.element = SVGHelper.createElement('rect');
	this.element.setAttribute('x', this.position.x);
	this.element.setAttribute('y', this.position.y);
	this.element.setAttribute('width', this.size.width);
	this.element.setAttribute('height', this.size.height);
	this.element.setAttribute('fill', this.fill);
	this.element.setAttribute('trigger', this.triggerRef);
}

module.exports = Trigger;
