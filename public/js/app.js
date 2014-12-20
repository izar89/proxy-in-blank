(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
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

},{"./modules/audio/Triggers":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/Triggers.js","./modules/companions/Companions":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/companions/Companions.js","./modules/soundcloud/SoundCloud":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/soundcloud/SoundCloud.js","./modules/util/requestAnimationFrame":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/requestAnimationFrame.js","./modules/webgl/Scene":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Scene.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/sounds.json":[function(require,module,exports){
module.exports=module.exports={
    "sounds": [{
        "id": 1,
        "file": "sounds/1.mp3"
    }, {
        "id": 2,
        "file": "sounds/2.mp3"
    }, {
        "id": 3,
        "file": "sounds/3.mp3"
    }, {
        "id": 4,
        "file": "sounds/4.mp3"
    }, {
        "id": 5,
        "file": "sounds/5.mp3"
    }, {
        "id": 6,
        "file": "sounds/6.mp3"
    }, {
        "id": 7,
        "file": "sounds/7.mp3"
    }, {
        "id": 8,
        "file": "sounds/8.mp3"
    }, {
        "id": 9,
        "file": "sounds/9.mp3"
    }, {
        "id": 10,
        "file": "sounds/10.mp3"
    }, {
        "id": 11,
        "file": "sounds/11.mp3"
    }, {
        "id": 12,
        "file": "sounds/12.mp3"
    }, {
        "id": 13,
        "file": "sounds/13.mp3"
    }, {
        "id": 14,
        "file": "sounds/14.mp3"
    }, {
        "id": 15,
        "file": "sounds/15.mp3"
    }, {
        "id": 16,
        "file": "sounds/16.mp3"
    }, {
        "id": 17,
        "file": "sounds/17.mp3"
    }, {
        "id": 18,
        "file": "sounds/18.mp3"
    }, {
        "id": 19,
        "file": "sounds/19.mp3"
    }, {
        "id": 20,
        "file": "sounds/20.mp3"
    }, {
        "id": 21,
        "file": "sounds/21.mp3"
    }, {
        "id": 22,
        "file": "sounds/22.mp3"
    }, {
        "id": 23,
        "file": "sounds/23.mp3"
    }, {
        "id": 24,
        "file": "sounds/24.mp3"
    }, {
        "id": 25,
        "file": "sounds/25.mp3"
    }, {
        "id": 26,
        "file": "sounds/26.mp3"
    }]
}
},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/BufferLoader.js":[function(require,module,exports){
function BufferLoader(context, urlList, callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = [];
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function() {
		// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(
			request.response,
			function(buffer) {
				if (!buffer) {
					console.error('error decoding file data: ' + url);
					return;
				}
				loader.bufferList.push(buffer);
				if(++loader.loadCount === loader.urlList.length){
					loader.onload(loader.bufferList);
				}
			},
			function(error) {
				console.error('decodeAudioData error', error);
			}
		);
	};

	request.onerror = function() {
		console.error('BufferLoader: XHR error');
	};

	request.send();
};

BufferLoader.prototype.load = function() {
	for (var i = 0; i < this.urlList.length; ++i){
		this.loadBuffer(this.urlList[i].file, this.urlList[i].name);
	}
};

module.exports = BufferLoader;

},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/Player.js":[function(require,module,exports){
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
},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/Triggers.js":[function(require,module,exports){
/* globals AudioContext */

var Util = require('../util/Util');
var Trigger = require('../svg/Trigger');
var SVGHelper = require('../svg/SVGHelper');
var BufferLoader = require('./BufferLoader');
var Player = require('./Player');
var sounds = require('../../data/sounds').sounds;

var bounds, triggers, svg, player, socket, buffer, min_duration, max_duration;

function Triggers() {
	_initSettings();
}

function _initSettings() {
	bounds = {
		width: window.innerWidth,
		height: window.innerHeight,
		border: 40
	};

	svg = document.querySelector('svg').appendChild(SVGHelper.createElement('g'));
	triggers = [];

	var context = new AudioContext();
	player = new Player(context);

	min_duration = 18000;
	max_duration = 20000;

	var loader = new BufferLoader(context, sounds, _initSocket);
	loader.load();
}

function _initSocket(b) {
	buffer = b;
	socket = io('/');
	socket.addEventListener('add_trigger', _addTrigger);
	socket.addEventListener('trigger_played', _playSocketTrigger);
}

function _addTrigger(t) {
	var trigger = new Trigger(t);
	trigger.sound = buffer[(t.sound.id - 1)];
	trigger.panning = Util.getPanning(bounds, trigger.position.x);
	trigger.volume = Util.getVolume(bounds, trigger.position.y);
	trigger.element.addEventListener('mouseover', _triggerHandler, false);
	svg.appendChild(trigger.element);
	triggers.push(trigger);

	var duration = max_duration + t.sound.id / sounds.length * (min_duration - max_duration);
	var player = trigger.move(duration);

	player.onfinish = function() {
		svg.removeChild(trigger.element);
		triggers = _.reject(triggers, trigger);
	};
}

function _triggerHandler(e) {
	var curTrigger = _.findWhere(triggers, {
		'timestamp': parseInt(e.currentTarget.getAttribute('timestamp'))
	});
	player.play(curTrigger);

	socket.emit('play_trigger', curTrigger.timestamp);
}

function _playSocketTrigger(timestamp) {
	var curTrigger = _.findWhere(triggers, {
		'timestamp': timestamp
	});
	if (curTrigger) {
		player.play(curTrigger);
	}
}

Triggers.prototype.update = function() {
    for (var i = 0; i < triggers.length; i++) {
    	var curTrigger = triggers[i];
    	curTrigger.panning = Util.getPanning(bounds, curTrigger.element.getBoundingClientRect().left);
    }
};

module.exports = Triggers;
},{"../../data/sounds":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/sounds.json","../svg/SVGHelper":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/SVGHelper.js","../svg/Trigger":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/Trigger.js","../util/Util":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/Util.js","./BufferLoader":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/BufferLoader.js","./Player":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/Player.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/companions/Companions.js":[function(require,module,exports){
var Companion = require('../svg/Companion');
var SVGHelper = require('../svg/SVGHelper');

var companions, svg, self, socket;

function Companions() {
	_initSettings();
	_initSocket();
}

function _initSettings() {
	svg = document.querySelector('svg').appendChild(SVGHelper.createElement('g'));
	companions = [];
}

function _initSocket() {
	socket = io('/');
	socket.addEventListener('self', _createSelf);
	socket.addEventListener('add_companion', _addCompanion);
	socket.addEventListener('move_companion', _moveCompanion);
	socket.addEventListener('remove_companion', _removeCompanion);
}

function _createSelf(client) {
	self = new Companion(client);
	svg.appendChild(self.element);
}

Companions.prototype.moveSelf = function(e) {
	if(self) {
		self.move({x: e.pageX, y: e.pageY});
		socket.emit('update_position', {
			x: self.position.x,
			y: self.position.y
		});
	}
};

function _addCompanion(client) {
	var companion = new Companion(client);
	companions.push(companion);
	svg.appendChild(companion.element);
}

function _moveCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	companion.move({x: client.x, y: client.y});
}

function _removeCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	svg.removeChild(companion.element);
	companions = _.reject(companions, companion);
}

module.exports = Companions;
},{"../svg/Companion":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/Companion.js","../svg/SVGHelper":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/SVGHelper.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/soundcloud/SoundCloud.js":[function(require,module,exports){
/* globals SC */

var result, currentTracks, socket, currentTrack;

function SoundCloud() {
	initClient();
	initSocket();
}

function initClient() {
	SC.initialize({
		client_id: 'bd3361bf40be90ef0b5bdf94c008674c',
		redirect_uri: ''
	});
}

function initSocket() {
	socket = io('/');
	initSoundbar();
	socket.addEventListener('currentTrack', currentTrackHandler, false);
	socket.addEventListener('emptyPlaylist', emptyPlaylistHandler, false);
}

function initSoundbar() {
	var searchInput = document.querySelector('#soundbar-search input');
	searchInput.addEventListener('keyup', keyUpHandler);

	result = document.querySelector('#search-results');
}

function keyUpHandler(e) {
	if (this.value.length >= 3) {
		searchSong(this.value);
	} else {
		result.innerHTML = '';
	}
}

function searchSong(value) {
	SC.get('/tracks', {
		q: value,
		limit: 5
	}, function(tracks, error) {
		showTracks(tracks);
	});
}

function showTracks(tracks) {
	result.innerHTML = '';
	currentTracks = [];
	if(tracks.length > 0) {
		for (var i = 0; i < tracks.length; i++) {
			var li = document.createElement('li');
			li.innerHTML = tracks[i].title + '<br />' + tracks[i].user.username;
			li.addEventListener('click', selectTrackHandler, false);
			result.appendChild(li);
			currentTracks.push(tracks[i]);
			li.setAttribute('data-id', i);
		}
	} else {
		result.innerHTML = '<li>Couldn\'t find any matching tracks :(</li>';
	}
}

function selectTrackHandler(e) {
	var curTrack = currentTracks[e.currentTarget.getAttribute('data-id')];
	socket.emit('selected_track', curTrack);
}

function currentTrackHandler(track) {
	if(!currentTrack || currentTrack.title !== track.title) {
		if(track.stream_url) {
			currentTrack = track;
			var thumb = document.querySelector('#song .thumb');
			var title = document.querySelector('#song .title');
			var artist = document.querySelector('#song .artist');
			if(track.thumb) {
				thumb.innerHTML = '<img src="'+ track.thumb +'" alt="thumb" />';
			}
			title.innerHTML = track.title;
			artist.innerHTML = track.artist;

			var audio = document.querySelector('#track');
			audio.setAttribute('src', track.stream_url +'?client_id=bd3361bf40be90ef0b5bdf94c008674c');
			audio.currentTime = track.position;
			audio.play();
		}
	}
}

function emptyPlaylistHandler() {
	var thumb = document.querySelector('#song .thumb');
	var title = document.querySelector('#song .title');
	var artist = document.querySelector('#song .artist');
	thumb.innerHTML = '';
	title.innerHTML = '';
	artist.innerHTML = '';
}

module.exports = SoundCloud;
},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/Companion.js":[function(require,module,exports){
var SVGHelper = require('./SVGHelper');

function Companion(client) {
    this.position = {
        x: client.x,
        y: client.y
    } || {
        x: 0,
        y: 0
    };
    this.stroke = 8;
    this.radius = 16;
    this.color = client.color;
    this.movement = 0;
    if (client.id !== false) {
        this.clientid = client.id;
    }
    this.trailCoords = [];
    this.positionPrev = this.position;

    _create.call(this);
}

function _create() {
    this.element = SVGHelper.createElement('circle');
    this.element.setAttribute('cx', this.position.x);
    this.element.setAttribute('cy', this.position.y);
    this.element.setAttribute('r', this.radius);
    this.element.setAttribute('fill', 'none');
    this.element.setAttribute('stroke', this.color);
    this.element.setAttribute('stroke-width', this.stroke);
}

Companion.prototype.move = function(position) {
    this.position = position;
    this.element.setAttribute('cx', this.position.x);
    this.element.setAttribute('cy', this.position.y);
};

module.exports = Companion;
},{"./SVGHelper":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/SVGHelper.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/SVGHelper.js":[function(require,module,exports){
var namespace = "http://www.w3.org/2000/svg";

function SVGHelper(){

}

SVGHelper.createElement = function(el){
	return document.createElementNS(namespace, el);
};

module.exports = SVGHelper;

},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/Trigger.js":[function(require,module,exports){
var SVGHelper = require('./SVGHelper');
var Util = require('../util/Util');

function Trigger(trigger) {
	this.position = trigger.position || {x: 0, y: 0};
	this.size = {width: 40, height: 40};
	this.fill = Util.randomHsla(); // random nice/bright color
	this.timestamp = trigger.timestamp;

	_create.call(this);
}

function _create() {
	this.element = SVGHelper.createElement('rect');
	this.element.setAttribute('x', this.position.x);
	this.element.setAttribute('y', this.position.y);
	this.element.setAttribute('width', this.size.width);
	this.element.setAttribute('height', this.size.height);
	this.element.setAttribute('fill', this.fill);
	this.element.setAttribute('timestamp', this.timestamp);
}

Trigger.prototype.move = function(duration) {
    var player = this.element.animate([{
        transform: 'translateX(' + (this.position.x + window.innerWidth )+ 'px)'
    }, {
        transform: 'translateX(' + (this.position.x - 300) + 'px)'
    }], {
        duration: duration
    });

    return player;
};

module.exports = Trigger;

},{"../util/Util":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/Util.js","./SVGHelper":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/SVGHelper.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/Util.js":[function(require,module,exports){
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
},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/requestAnimationFrame.js":[function(require,module,exports){
module.exports = (function(){
	return  window.requestAnimationFrame       ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame    ||
	        window.oRequestAnimationFrame      ||
	        window.msRequestAnimationFrame     ||
	        function(callback, element){
	          window.setTimeout(callback, 1000 / 60);
	        };
})();

},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Ground.js":[function(require,module,exports){
var scene, groundMesh, groundMeshPositionX, groundMeshCopy, groundMeshCopyPositionX, noise = [], verticesWidth;

function Ground(scene_){
    scene = scene_;
    initGroundMesh();
    initGroundMeshCopy();
    addNoise();
}

function initGroundMesh(){
    var height = 450;
    verticesWidth = 80;
    var verticesheight = 50;
  var geometry = new THREE.PlaneGeometry(window.innerWidth, height, Math.round(window.innerWidth/verticesWidth), Math.round(height/verticesheight));
    var material = new THREE.MeshLambertMaterial({color: 0xf4b580, emissive: 0xe76f54, shading: THREE.FlatShading});
  groundMesh = new THREE.Mesh(geometry, material);
  groundMesh.rotation.x = -1.2;
  groundMesh.position.y = -window.innerHeight / 2 + 160;
  groundMesh.position.z = -370;
  scene.add(groundMesh);
  groundMeshPositionX = groundMesh.position.x;
}

function initGroundMeshCopy(){
    groundMeshCopy = groundMesh.clone();
  groundMeshCopy.rotation.x = -1.2;
  groundMeshCopy.position.x = window.innerWidth;
  groundMeshCopy.position.y = -window.innerHeight / 2 + 160;
  groundMeshCopy.position.z = -370;
  scene.add(groundMeshCopy);
  groundMeshCopyPositionX = groundMeshCopy.position.x;
}

function addNoise(){
    for(var i = 0; i < groundMesh.geometry.vertices.length; i++){
    noise[i] = Math.random() * 50;
    groundMesh.geometry.vertices[i].z = noise[i];
  }
}

Ground.prototype.update = function(speed){
    for (var i = 0, l = groundMesh.geometry.vertices.length; i < l; i++){
        //glue two water meshes together
        var rowSize = Math.round(window.innerWidth/verticesWidth) + 1;
        if(i % rowSize === 0){
            groundMeshCopy.geometry.vertices[i].z = groundMesh.geometry.vertices[i + (rowSize - 1)].z;
            groundMesh.geometry.vertices[i].z = groundMeshCopy.geometry.vertices[i + (rowSize - 1)].z;
        }
    }

    //sidescroll
    groundMesh.position.x = groundMesh.position.x - speed;
    groundMeshCopy.position.x = groundMeshCopy.position.x - speed;

    //snap back after sidescroll
    if(groundMesh.position.x < groundMeshPositionX - window.innerWidth){
        groundMesh.position.x = groundMeshPositionX;
        groundMeshCopy.position.x = groundMeshCopyPositionX;
    }

    groundMesh.geometry.computeFaceNormals();
};

module.exports = Ground;

},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Scene.js":[function(require,module,exports){
var Water = require('../webgl/Water');
var Ground = require('../webgl/Ground');
var Sky = require('../webgl/Sky');

var container, clock, scene, camera, renderer;
var speed, water, ground, sky;

function Scene(){
	container = document.querySelector('.container');
	clock = new THREE.Clock();

	speed = 1;

	initScene();
	initCamera();
	initLights();
	initObjects();
	initRenderer();
}

function initScene(){
	scene = new THREE.Scene();

	console.log(scene);
}

function initCamera(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -500, 1000);
	scene.add(camera);
}

function initLights(){
	// var hemiLight = new THREE.HemisphereLight(0xff7a81, 0x000000, 0.5);
 //  hemiLight.position.y = 500;
 //  scene.add(hemiLight);

	var spotLight = new THREE.SpotLight(0x999999, 1);
	spotLight.castShadow = true;
	spotLight.shadowDarkness = 0.3;
	spotLight.position.set(-1000, 330, 0);
	scene.add(spotLight);

	var pointLight = new THREE.PointLight(0x56bc72, 0.6);
	pointLight.position.set(500, 200, 0);
	scene.add(pointLight);
}

function initRenderer(){
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.bottom = '0px';
	container.appendChild(renderer.domElement);
}

function initObjects(){
	water = new Water(scene);
	ground = new Ground(scene);
	sky = new Sky(scene);
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

Scene.prototype.update = function(){
	var time = clock.getElapsedTime();

	//Objects
	water.update(time, speed);
	ground.update(speed - 0.3);
	sky.update(speed - 0.9);

	//Renderer
	renderer.render(scene, camera);
};

Scene.prototype.setSpeed = function(speed){
	this.speed = speed;
};

module.exports = Scene;

},{"../webgl/Ground":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Ground.js","../webgl/Sky":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Sky.js","../webgl/Water":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Water.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Sky.js":[function(require,module,exports){
var scene, skyMesh, skyMeshPositionX, skyMeshCopy, skyMeshCopyPositionX, noise = [], verticesWidth;

function Sky(scene_){
    scene = scene_;
    initSkyMesh();
    initSkyMeshCopy();
    addNoise();
}

function initSkyMesh(){
    var height = 450;
    verticesWidth = 80;
    var verticesheight = 50;
  var geometry = new THREE.PlaneGeometry(window.innerWidth, height, Math.round(window.innerWidth/verticesWidth), Math.round(height/verticesheight));
    var material = new THREE.MeshLambertMaterial({color: 0xe7f5fc, emissive: 0xd9f0ff, shading: THREE.FlatShading});
  skyMesh = new THREE.Mesh(geometry, material);
  skyMesh.rotation.x = 1.2;
  skyMesh.position.y = window.innerHeight / 2;
  console.log(window.innerHeight);
  skyMesh.position.z = -870;
  scene.add(skyMesh);
  skyMeshPositionX = skyMesh.position.x;
}

function initSkyMeshCopy(){
  skyMeshCopy = skyMesh.clone();
  skyMeshCopy.rotation.x = 1.2;
  skyMeshCopy.position.x = window.innerWidth;
  skyMeshCopy.position.y = window.innerHeight / 2;
  skyMeshCopy.position.z = -870;
  scene.add(skyMeshCopy);
  skyMeshCopyPositionX = skyMeshCopy.position.x;
}

function addNoise(){
    for(var i = 0; i < skyMesh.geometry.vertices.length; i++){
    noise[i] = Math.random() * 50;
    skyMesh.geometry.vertices[i].z = noise[i];
  }
}

Sky.prototype.update = function(speed){
    for (var i = 0, l = skyMesh.geometry.vertices.length; i < l; i++){
        //glue two water meshes together
        var rowSize = Math.round(window.innerWidth/verticesWidth) + 1;
        if(i % rowSize === 0){
            skyMeshCopy.geometry.vertices[i].z = skyMesh.geometry.vertices[i + (rowSize - 1)].z;
            skyMesh.geometry.vertices[i].z = skyMeshCopy.geometry.vertices[i + (rowSize - 1)].z;
        }
    }

    //sidescroll
    skyMesh.position.x = skyMesh.position.x - speed;
    skyMeshCopy.position.x = skyMeshCopy.position.x - speed;

    //snap back after sidescroll
    if(skyMesh.position.x < skyMeshPositionX - window.innerWidth){
        skyMesh.position.x = skyMeshPositionX;
        skyMeshCopy.position.x = skyMeshCopyPositionX;
    }

    skyMesh.geometry.computeFaceNormals();
};

module.exports = Sky;

},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Water.js":[function(require,module,exports){
var Util = require('../util/Util');
var scene, waterMesh, waterMeshPositionX, waterMeshCopy, waterMeshCopyPositionX, noise = [], verticesWidth;

function Water(scene_){
	scene = scene_;
	initWaterMesh();
	initWaterMeshCopy();
	addNoise();
	//initWaterDebugMesh();
}

function initWaterMesh(){
	var height = 320;
	verticesWidth = 44;
	var verticesheight = 30;
  var geometry = new THREE.PlaneGeometry(window.innerWidth, height, Math.round(window.innerWidth/verticesWidth), Math.round(height/verticesheight));
	var material = new THREE.MeshLambertMaterial({color: 0x77fde5, emissive: 0x00576b, shading: THREE.FlatShading});
  waterMesh = new THREE.Mesh(geometry, material);
  waterMesh.rotation.x = -1;
  waterMesh.position.y = -window.innerHeight / 2 + 60;
  scene.add(waterMesh);
  waterMeshPositionX = waterMesh.position.x;
}

function initWaterMeshCopy(){
	waterMeshCopy = waterMesh.clone();
	waterMeshCopy.rotation.x = -1;
  waterMeshCopy.position.x = window.innerWidth;
  waterMeshCopy.position.y = waterMesh.position.y;
  scene.add(waterMeshCopy);
  waterMeshCopyPositionX = waterMeshCopy.position.x;
}

function addNoise(){
	for(var i = 0; i < waterMesh.geometry.vertices.length; i++){
  	noise[i] = Math.random() * 30;
  	waterMesh.geometry.vertices[i].z = noise[i];
  	waterMeshCopy.geometry.vertices[i].z = noise[i];
  }
}

// function initWaterDebugMesh(){
// 	var material = new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true });
// 	var waterDebugMesh = new THREE.Mesh(waterMesh.geometry, material);
//   waterDebugMesh.rotation.x = - 1;
//   waterDebugMesh.position.y = waterDebugMesh.position.y +1;
//   waterDebugMesh.position.z = waterMesh.position.z;
//   scene.add(waterDebugMesh);
// }


Water.prototype.update = function(time, speed){
	for (var i = 0, l = waterMesh.geometry.vertices.length; i < l; i++){
		//calc noise
		var noiseRange = 20;
		noise[i] += 0.5 * ( 0.5 - Math.random() );
		noise[i] = THREE.Math.clamp( noise[ i ], -noiseRange, noiseRange);

		//sinus
		var amplitude =	Util.map(i, 0, waterMesh.geometry.vertices.length, 30, 0);
		var frequency =  i / 5;
		var phase = ((time * 10) + i) / 7;
		var sinus = amplitude * Math.sin(frequency + phase);
		waterMesh.geometry.vertices[ i ].z = sinus + noise[i];
		waterMeshCopy.geometry.vertices[ i ].z = sinus + noise[i];

		//glue two water meshes together
		var rowSize = Math.round(window.innerWidth/verticesWidth) + 1;
		if(i % rowSize === 0){
			waterMeshCopy.geometry.vertices[i].z = waterMesh.geometry.vertices[i + (rowSize - 1)].z;
			waterMesh.geometry.vertices[i].z = waterMeshCopy.geometry.vertices[i + (rowSize - 1)].z;
		}
	}

	//sidescroll
	waterMesh.position.x = waterMesh.position.x - speed;
	waterMeshCopy.position.x = waterMeshCopy.position.x - speed;

	//snap back after sidescroll
	if(waterMesh.position.x < waterMeshPositionX - window.innerWidth){
		waterMesh.position.x = waterMeshPositionX;
		waterMeshCopy.position.x = waterMeshCopyPositionX;
	}

	waterMesh.geometry.verticesNeedUpdate = true;
	waterMesh.geometry.computeFaceNormals();
	waterMeshCopy.geometry.verticesNeedUpdate = true;
	waterMeshCopy.geometry.computeFaceNormals();
};

module.exports = Water;


},{"../util/Util":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/Util.js"}]},{},["./_js/app.js"]);
