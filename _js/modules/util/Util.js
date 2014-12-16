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

Util.getPanning = function(bounds, x) {
    var range = bounds.width - (bounds.border * 2);
    var half_range = range / 2;
    x = x - bounds.border;
    var panning = x / range;
    if (panning < 0.5) {
        panning = -(1 - (x / half_range));
    } else if (panning === 0.5) {
        panning = 0;
    } else {
        panning = (x - half_range) / half_range;
    }
    return panning;
};

Util.getVolume = function(bounds, y) {
    var range = bounds.height - (bounds.border * 2);
    y = y - bounds.border;
    return 1 - (y / range);
};

module.exports = Util;