(function(){

    window.requestAnimationFrame = require('./modules/util/requestAnimationFrame');
    var Scene = require('./modules/webgl/Scene');
    var Companions = require('./modules/companions/Companions');
    var Triggers = require('./modules/audio/Triggers');
    var SoundCloud = require('./modules/soundcloud/SoundCloud');

    var stats, scene, companions, triggers, soundcloud;

    function init(){
        stats = initStats();
        scene = new Scene();
        companions = new Companions();
        triggers = new Triggers();
        soundcloud = new SoundCloud();

        document.addEventListener('mousemove', _triggerMovement);
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
        triggers.update();

        requestAnimationFrame(update);
    }

    function _triggerMovement(e) {
        companions.moveSelf(e);
    }

    function _resizeCanvas() {
        companions.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    init();

})();
