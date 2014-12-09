function Util() {

}

Util.map = function(value, imin, imax, omin, omax) {
    return omin + (omax - omin) * ((value - imin) / (imax - imin));
};

Util.randomPosition = function(bounds) {
    bounds.border = bounds.border || 0;
    return {
        x: bounds.border + Math.round(Math.random() * (bounds.width - (bounds.border * 2))),
        y: bounds.border + Math.round(Math.random() * (bounds.height - (bounds.border * 2)))
    };
};

Util.randomHsla = function() {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
};

Util.hitTest = function(point, rect) {
    return (point.x > rect.x && point.x < (rect.x + rect.width) && point.y > rect.y && point.y < (rect.y + rect.height));
};

module.exports = Util;