(function(){

	window.requestAnimationFrame = require('./modules/util/requestAnimationFrame');
	var Scene = require('./modules/webgl/Scene');

	var stats, scene;

	function init(){
		stats = initStats();
		scene = new Scene();

		update();
	}

	function initStats(){
		stats = new Stats();
  	stats.setMode(0);
  	document.body.appendChild(stats.domElement);

  	stats.domElement.style.position = 'absolute';
  	stats.domElement.style.top = '0px';
  	stats.domElement.style.left = '0px';

  	return stats;
	}

	function update(){
		stats.update();
		scene.update(); //threejs scene

		requestAnimationFrame(update);
	}

	init();

})();
