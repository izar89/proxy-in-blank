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
