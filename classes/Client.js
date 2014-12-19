var Util = require('../_js/modules/util/Util');

function Client(id, socketid) {
	this.id = id;
	this.socketid = socketid;
	this.x = 0;
	this.y = 0;
	this.color = Util.randomHsla();
}

module.exports = Client;