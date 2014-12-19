var SVGHelper = require('./SVGHelper');

function Companion(client) {
    this.position = {
        x: client.x,
        y: client.y
    } || {
        x: 0,
        y: 0
    };
    this.stroke = 8;
    this.radius = 16;
    this.color = client.color;
    this.movement = 0;
    if (client.id !== false) {
        this.clientid = client.id;
    }
    this.trailCoords = [];
    this.positionPrev = this.position;

    _create.call(this);
}

function _create() {
    this.element = SVGHelper.createElement('circle');
    this.element.setAttribute('cx', this.position.x);
    this.element.setAttribute('cy', this.position.y);
    this.element.setAttribute('r', this.radius);
    this.element.setAttribute('fill', 'none');
    this.element.setAttribute('stroke', this.color);
    this.element.setAttribute('stroke-width', this.stroke);
}

Companion.prototype.move = function(position) {
    this.position = position;
    this.element.setAttribute('cx', this.position.x);
    this.element.setAttribute('cy', this.position.y);
};

module.exports = Companion;