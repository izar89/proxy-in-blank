var Util = require('../util/Util');
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

