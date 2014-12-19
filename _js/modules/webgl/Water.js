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

