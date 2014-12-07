(function(){

    window.requestAnimationFrame = require('./modules/util/requestAnimationFrame');
    var Scene = require('./modules/webgl/Scene');
    var Companions = require('./modules/companions/Companions');

    var stats, scene, companions;

    function init(){
        stats = initStats();
        scene = new Scene();
        companions = new Companions();

        document.addEventListener('mousemove', companions.moveSelf);
        window.addEventListener('resize', _resizeCanvas, false);

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
        companions.update();

        requestAnimationFrame(update);
    }

    function _resizeCanvas() {
        companions.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    init();

})();