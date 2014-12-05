function Util(){

}

Util.map = function (value, imin, imax, omin, omax){
	return omin + (omax - omin) * ((value - imin) / (imax - imin));
};

module.exports = Util;
