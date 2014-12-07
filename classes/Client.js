function Client(id, socketid) {
	this.id = id;
	this.socketid = socketid;
	this.x = 0;
	this.y = 0;
}

module.exports = Client;