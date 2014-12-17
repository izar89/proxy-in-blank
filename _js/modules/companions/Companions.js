var Companion = require('./Companion');
var settings = require('../../data/settings');

var companions, stage, self, socket;

function Companions() {
	_initSettings();
	_initCanvas();
	_createSelf();
	_initSocket();
}

function _initSettings() {
	companions = [];
}

function _initCanvas() {
	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.querySelector('.container').appendChild(canvas);

	stage = new createjs.Stage(canvas);
}

function _createSelf() {
	self = new createjs.Shape();
	self.graphics.f('#E34B2A').dc(0, 0, 20);
	self.trail = [];
	stage.addChild(self);
}

function _addTrail(object) {
	var trail = new createjs.Shape();

	if (typeof object.xpast !== "undefined" || typeof object.ypast !== "undefined") {
		trail.graphics.s("#E34B2A").ss(1, "round").quadraticCurveTo(object.xpast, object.ypast, object.x, object.y);
		setInterval(function() {
			trail.alpha -= 0.05;
			if(trail.alpha < 0) {
				stage.removeChild(trail);
				object.xpast = object.x;
				object.ypast = object.y;
			}
		}, 100);
		object.trail.push(trail);
		stage.addChild(trail);
	}

	if (object.trail.length > 15) {
		stage.removeChild(object.trail.shift());
	}

	for (var i = 0; i < object.trail.length; i++) {
		object.trail[i].alpha = (i / 100) * 15;
	}

	object.xpast = object.x;
	object.ypast = object.y;

	stage.addChildAt(trail, 0);
}

function _removeTrail(trail) {
	for (var i = 0; i < trail.length; i++) {
		stage.removeChild(trail[i]);
	}
}

Companions.prototype.moveSelf = function(e) {
	self.x = e.pageX;
	self.y = e.pageY;
	socket.emit('update_position', {
		x: e.pageX,
		y: e.pageY
	});
	_addTrail(self);
};

function _initSocket() {
	socket = io(settings.server);
	socket.addEventListener('add_companion', _addCompanion);
	socket.addEventListener('move_companion', _moveCompanion);
	socket.addEventListener('remove_companion', _removeCompanion);
}

function _addCompanion(client) {
	var companion = new Companion(client);
	companions.push(companion);
	stage.addChild(companion);
}

function _moveCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	companion.x = client.x;
	companion.y = client.y;
	_addTrail(companion);
}

function _removeCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	stage.removeChild(companion);
	_removeTrail(companion.trail);
	companions = _.reject(companions, companion);
}

Companions.prototype.update = function() {
	stage.update();
};

Companions.prototype.resizeCanvas = function(width, height) {
	stage.canvas.width = width;
	stage.canvas.height = height;
};

module.exports = Companions;