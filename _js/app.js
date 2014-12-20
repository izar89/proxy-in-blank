(function(){

    window.requestAnimationFrame = require('./modules/util/requestAnimationFrame');
    var Scene = require('./modules/webgl/Scene');
    var Companions = require('./modules/companions/Companions');
    var Triggers = require('./modules/audio/Triggers');
    var SoundCloud = require('./modules/soundcloud/SoundCloud');

    var scene, companions, triggers, soundcloud;

    function init(){
        scene = new Scene();
        triggers = new Triggers();
        companions = new Companions();
        soundcloud = new SoundCloud();

        document.addEventListener('mousemove', _triggerMovement);
        document.querySelector('#modal').addEventListener('click', modalHandler);

        update();
    }

    function modalHandler(e) {
        e.preventDefault();
        var modal = document.querySelector('#modal');
        var player = modal.animate([{opacity: 1}, {opacity: 0}], 500);
        player.onfinish = function() {
            modal.parentNode.removeChild(modal);
        };
    }

    function update(){
        scene.update();
        triggers.update();

        requestAnimationFrame(update);
    }

    function _triggerMovement(e) {
        companions.moveSelf(e);
    }

    init();

})();
