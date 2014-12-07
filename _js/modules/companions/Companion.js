function Companion(client) {
	var companion = new createjs.Shape();
	companion.graphics.f('#e39c8d').dc(client.x, client.y, 20);
	if(client.id) {
		companion.clientid = client.id;
	}
	companion.trail = [];
	return companion;
}

module.exports = Companion;