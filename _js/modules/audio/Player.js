function Player(context) {
    this.context = context;
}

Player.prototype.play = function(audio) {
    var source = this.context.createBufferSource();
    source.buffer = audio.sound;
    source.start(0);

    var panner = this.context.createPanner();
    panner.panningModel = 'equalPower';
    panner.setPosition(audio.panning, 0, 1 - Math.abs(audio.panning));

    var gain = this.context.createGain();
    gain.gain.value = audio.volume;

    source.connect(panner);
    panner.connect(gain);
    gain.connect(this.context.destination);
};

module.exports = Player;