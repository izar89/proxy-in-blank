function Companion(client) {
	var companion = new createjs.Shape();
	companion.graphics.f('#e39c8d').dc(0, 0, 20);
	companion.x = client.x;
	companion.y = client.y;
	if(client.id !== false) {
		companion.clientid = client.id;
	}
	companion.trail = [];
	return companion;
}

module.exports = Companion;