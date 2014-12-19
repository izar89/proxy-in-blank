var Companion = require('../svg/Companion');

var companions, svg, self, socket;

function Companions() {
	_initSettings();
	_initSocket();
}

function _initSettings() {
	svg = document.querySelector('#companions');
	companions = [];
}

function _initSocket() {
	socket = io('/');
	socket.addEventListener('self', _createSelf);
	socket.addEventListener('add_companion', _addCompanion);
	socket.addEventListener('move_companion', _moveCompanion);
	socket.addEventListener('remove_companion', _removeCompanion);
}

function _createSelf(client) {
	self = new Companion(client);
	svg.appendChild(self.element);
}

function _addTrail(object) {
	/*var trail = new createjs.Shape();

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

	stage.addChildAt(trail, 0);*/
}

function _removeTrail(trail) {
	/*
	for (var i = 0; i < trail.length; i++) {
		stage.removeChild(trail[i]);
	}*/
}

Companions.prototype.moveSelf = function(e) {
	if(self) {
		self.move({x: e.pageX, y: e.pageY});
		socket.emit('update_position', {
			x: self.position.x,
			y: self.position.y
		});

		//_moveTrail(self);
	}
};

function _moveTrail(companion) {
	/*companion.movement++;
	if(companion.movement >= 20) {
		companion.trailCoords.push({x: companion.position.x, y: companion.position.y});
		companion.movement = 0;
	}

	if(companion.trailCoords.length > 4) {
		companion.trailCoords.shift();
	}

	companion.updateTrail({x: companion.position.x, y: companion.position.y});*/
}

function _addCompanion(client) {
	var companion = new Companion(client);
	companions.push(companion);
	svg.appendChild(companion.element);
	//svg.appendChild(companion.trail);
}

function _moveCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	companion.move({x: client.x, y: client.y});
	//_addTrail(companion);
}

function _removeCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	svg.removeChild(companion.element);
	//_removeTrail(companion.element.trail);
	companions = _.reject(companions, companion);
}

module.exports = Companions;