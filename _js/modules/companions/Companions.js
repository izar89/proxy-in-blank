var Companion = require('../svg/Companion');
var SVGHelper = require('../svg/SVGHelper');

var companions, svg, self, socket;

function Companions() {
	_initSettings();
	_initSocket();
}

function _initSettings() {
	svg = document.querySelector('svg').appendChild(SVGHelper.createElement('g'));
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

Companions.prototype.moveSelf = function(e) {
	if(self) {
		self.move({x: e.pageX, y: e.pageY});
		socket.emit('update_position', {
			x: self.position.x,
			y: self.position.y
		});
	}
};

function _addCompanion(client) {
	var companion = new Companion(client);
	companions.push(companion);
	svg.appendChild(companion.element);
}

function _moveCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	companion.move({x: client.x, y: client.y});
}

function _removeCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	svg.removeChild(companion.element);
	companions = _.reject(companions, companion);
}

module.exports = Companions;