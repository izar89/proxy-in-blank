(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
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

    function _triggerMovement(e) {
        companions.moveSelf(e);
    }

    function _resizeCanvas() {
        companions.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    init();

})();

},{"./modules/audio/Triggers":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/Triggers.js","./modules/companions/Companions":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/companions/Companions.js","./modules/util/requestAnimationFrame":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/requestAnimationFrame.js","./modules/webgl/Scene":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Scene.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/settings.json":[function(require,module,exports){
module.exports={
	"server": "https://calm-oasis-6526.herokuapp.com"
}
},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/sounds.json":[function(require,module,exports){
module.exports=module.exports=module.exports={
    "sounds": [
	    {
	        "name": "SD",
	        "file": "sound/sd.wav"
	    }, {
	        "name": "HH",
	        "file": "sound/hh.wav"
	    }, {
	        "name": "BD",
	        "file": "sound/bd.wav"
	    }
    ]
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
var BufferLoader = require('./BufferLoader');
var Player = require('./Player');
var sounds = require('../../data/sounds').sounds;
var settings = require('../../data/settings');

var bounds, triggers, svg, player, socket;

function Triggers() {
	_initSettings();
}

function _initSettings() {
	bounds = {
		width: window.innerWidth,
		height: window.innerHeight,
		border: 40
	};

	svg = document.querySelector('svg');
	triggers = [];

	var context = new AudioContext();
	player = new Player(context);

	var loader = new BufferLoader(context, sounds, _createTriggers);
	loader.load();
}

function _createTriggers(buffer) {
	for(var i = 0; i < buffer.length; i++) {
		var trigger = new Trigger(Util.randomPosition(bounds), {width: 40, height: 40}, i);
		trigger.sound = buffer[i];
		trigger.panning = Util.getPanning(bounds, trigger.position.x);
		trigger.volume = Util.getVolume(bounds, trigger.position.y);
		trigger.element.addEventListener('mouseover', _triggerHandler, false);
		svg.appendChild(trigger.element);
		triggers.push(trigger);
	}

	_initSocket();
}

function _triggerHandler(e) {
	var curTrigger = triggers[e.currentTarget.getAttribute('trigger')];
	player.play(curTrigger);

	socket.emit('trigger_play', triggers.indexOf(curTrigger));
}

function _initSocket() {
	socket = io(settings.server);
	socket.addEventListener('trigger_played', _playSocketTrigger);
}

function _playSocketTrigger(trigger) {
	console.log(trigger);
	player.play(triggers[trigger]);
}

module.exports = Triggers;
},{"../../data/settings":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/settings.json","../../data/sounds":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/sounds.json","../svg/Trigger":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/Trigger.js","../util/Util":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/util/Util.js","./BufferLoader":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/BufferLoader.js","./Player":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/audio/Player.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/companions/Companion.js":[function(require,module,exports){
function Companion(client) {
	var companion = new createjs.Shape();
	companion.graphics.f('#e39c8d').dc(client.x, client.y, 20);

	if(client.id) {
		companion.clientid = client.id;
	}
	companion.trail = [];
	return companion;
}

module.exports = Companion;
},{}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/companions/Companions.js":[function(require,module,exports){
var Companion = require('./Companion');
var settings = require('../../data/settings');

var companions, stage, self, socket;

function Companions() {
	_initSettings();
	_initCanvas();
	_createSelf();
	_initSocket();
}

function _initSettings() {
	companions = [];
}

function _initCanvas() {
	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.querySelector('.container').appendChild(canvas);

	stage = new createjs.Stage(canvas);
}

function _createSelf() {
	self = new createjs.Shape();
	self.graphics.f('#E34B2A').dc(0, 0, 20);
	self.trail = [];
	stage.addChild(self);
}

function _addTrail(object) {
	var trail = new createjs.Shape();

	if (typeof object.xpast !== "undefined" || typeof object.ypast !== "undefined") {
		trail.graphics.s("#E34B2A").ss(1, "round").quadraticCurveTo(object.xpast, object.ypast, object.x, object.y);
		setInterval(function() {
			trail.alpha -= 0.05;
			if(trail.alpha < 0) {
				stage.removeChild(trail);
				object.xpast = object.x;
				object.ypast = object.y;
			}
		}, 100);
		object.trail.push(trail);
		stage.addChild(trail);
	}

	if (object.trail.length > 15) {
		stage.removeChild(object.trail.shift());
	}

	for (var i = 0; i < object.trail.length; i++) {
		object.trail[i].alpha = (i / 100) * 15;
	}

	object.xpast = object.x;
	object.ypast = object.y;

	stage.addChildAt(trail, 0);
}

function _removeTrail(trail) {
	for (var i = 0; i < trail.length; i++) {
		stage.removeChild(trail[i]);
	}
}

Companions.prototype.moveSelf = function(e) {
	self.x = e.pageX;
	self.y = e.pageY;
	socket.emit('update_position', {
		x: e.pageX,
		y: e.pageY
	});
	_addTrail(self);
};

function _initSocket() {
	socket = io(settings.server);
	socket.addEventListener('add_companion', _addCompanion);
	socket.addEventListener('move_companion', _moveCompanion);
	socket.addEventListener('remove_companion', _removeCompanion);
}

function _addCompanion(client) {
	var companion = new Companion(client);
	companions.push(companion);
	stage.addChild(companion);
}

function _moveCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	companion.x = client.x;
	companion.y = client.y;
	_addTrail(companion);
}

function _removeCompanion(client) {
	var companion = _.findWhere(companions, {
		'clientid': client.id
	});
	stage.removeChild(companion);
	_removeTrail(companion.trail);
	companions = _.reject(companions, companion);
}

Companions.prototype.update = function() {
	stage.update();
};

Companions.prototype.resizeCanvas = function(width, height) {
	stage.canvas.width = width;
	stage.canvas.height = height;
};

module.exports = Companions;
},{"../../data/settings":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/data/settings.json","./Companion":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/companions/Companion.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/svg/SVGHelper.js":[function(require,module,exports){
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

function Trigger(position, size, triggerRef) {
	this.position = position || {x: 0, y: 0};
	this.size = size || {width: 40, height: 40};
	this.fill = Util.randomHsla(); // random nice/bright color
	this.triggerRef = triggerRef;

	_create.call(this);
}

function _create() {
	this.element = SVGHelper.createElement('rect');
	this.element.setAttribute('x', this.position.x);
	this.element.setAttribute('y', this.position.y);
	this.element.setAttribute('width', this.size.width);
	this.element.setAttribute('height', this.size.height);
	this.element.setAttribute('fill', this.fill);
	this.element.setAttribute('trigger', this.triggerRef);
}

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

Ground.prototype.update = function(){
	for (var i = 0, l = groundMesh.geometry.vertices.length; i < l; i++){
		//glue two water meshes together
		var rowSize = Math.round(window.innerWidth/verticesWidth) + 1;
		if(i % rowSize === 0){
			groundMeshCopy.geometry.vertices[i].z = groundMesh.geometry.vertices[i + (rowSize - 1)].z;
			groundMesh.geometry.vertices[i].z = groundMeshCopy.geometry.vertices[i + (rowSize - 1)].z;
		}
	}

	//sidescroll
	groundMesh.position.x = groundMesh.position.x - 0.7;
	groundMeshCopy.position.x = groundMeshCopy.position.x - 0.7;

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

var container, clock, scene, camera, renderer;
var water, ground;

function Scene(){
	container = document.querySelector('.container');
	clock = new THREE.Clock();

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
	//camera.rotation.x = - Math.PI / 2; //top
	scene.add(camera);
}

function initLights(){
	var hemiLight = new THREE.HemisphereLight(0xff7a81, 0x000000, 0.5);
  hemiLight.position.y = 500;
  scene.add(hemiLight);

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
}

Scene.prototype.update = function(){
	var time = clock.getElapsedTime();

	//Objects
	water.update(time);
	ground.update();

	//Renderer
	renderer.render(scene, camera);
};

module.exports = Scene;

},{"../webgl/Ground":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Ground.js","../webgl/Water":"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Water.js"}],"/Users/Jasper/Dropbox/School/Semester 5/RMDIII/PROXY-IN-BLANK/_js/modules/webgl/Water.js":[function(require,module,exports){
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


Water.prototype.update = function(time){
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
	waterMesh.position.x = waterMesh.position.x - 1;
	waterMeshCopy.position.x = waterMeshCopy.position.x - 1;

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
