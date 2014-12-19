var Water = require('../webgl/Water');
var Ground = require('../webgl/Ground');
var Sky = require('../webgl/Sky');

var container, clock, scene, camera, renderer;
var speed, water, ground, sky;
var copyPass, composer;

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

function initPostprocessing() {
  var renderModel = new THREE.RenderPass(scene, camera);
  copyPass = new THREE.ShaderPass(THREE.CopyShader);
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderModel);
  composer.addPass(copyPass);
  copyPass.renderToScreen = true;

  var effectFilm = new THREE.FilmPass(0.1, 0, 448, false);
  composer.addPass(effectFilm);
}

function initObjects(){
	water = new Water(scene);
	ground = new Ground(scene);
	sky = new Sky(scene);
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
