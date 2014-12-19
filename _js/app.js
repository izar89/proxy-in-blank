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
        triggers = new Triggers();
        companions = new Companions();
        soundcloud = new SoundCloud();

        document.addEventListener('mousemove', _triggerMovement);
        window.addEventListener('resize', _resizeCanvas, false);

        document.querySelector('#modal').addEventListener('click', modalHandler);

        update();
    }

    function modalHandler(e) {
        e.preventDefault();
        var modal = document.querySelector('#modal');
        var player = modal.animate([{opacity: 1}, {opacity: 0}], 500);
        player.onfinish = function() {
            modal.parentNode.removeChild(modal);
        }
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
        triggers.update();

        requestAnimationFrame(update);
    }

    function _triggerMovement(e) {
        companions.moveSelf(e);
    }

    function _resizeCanvas() {
        // resize shizzlewizzle
    }

    init();

})();
