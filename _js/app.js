(function(){

    window.requestAnimationFrame = require('./modules/util/requestAnimationFrame');
    var Scene = require('./modules/webgl/Scene');
    var Companions = require('./modules/companions/Companions');
    var Triggers = require('./modules/audio/Triggers');

    var stats, scene, companions, triggers;

    function init(){
        stats = initStats();
        scene = new Scene();
        companions = new Companions();
        triggers = new Triggers();

        document.addEventListener('mousemove', _triggerMovement);
        window.addEventListener('resize', _resizeCanvas, false);
        window.addEventListener('focus', _focusHandler, false);
        window.addEventListener('blur', _blurHandler, false);

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
        triggers.update();

        requestAnimationFrame(update);
    }

    function _focusHandler() {
        triggers.play();
    }

    function _blurHandler() {
        triggers.pause();
    }

    function _triggerMovement(e) {
        companions.moveSelf(e);
    }

    function _resizeCanvas() {
        companions.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    init();

})();
