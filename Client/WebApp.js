var mouse = new THREE.Vector2();
var intersects = [];
// var SceneGeom = [];
var clock = new THREE.Clock;
var lockObject = null;
var lockObjectStartingPosition = null;
var downTime = 0.0;
var instructions = [];
var objectsGroup = new THREE.Group();
var instructionsGroup = new THREE.Group();

console.log("Web App loaded");

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor( 0xffffff );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.sortObjects = false;
document.body.appendChild(renderer.domElement);

var raycaster = new THREE.Raycaster();
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 1500);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 200;
scene.add(camera);

var objectSize = window.innerHeight * 0.05;

scene.add(instructionsGroup);
scene.add(objectsGroup);


window.addEventListener('mousedown', function(event) {
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(objectsGroup.children);
  if(intersects.length) {
    lockObject = intersects[0];
    lockObjectStartingPosition = new THREE.Vector2(lockObject.object.position.x, lockObject.object.position.y);
  } else {
    var circ = new THREE.CircleGeometry(objectSize*0.5, 32);
    var m = new THREE.MeshBasicMaterial({color:0x000000});
    var c = new THREE.Mesh(circ, m);
    c.position.x = mouse.x*window.innerWidth * 0.5;
    c.position.y = mouse.y*window.innerHeight* 0.5;
    c.position.z = 0.0;
    objectsGroup.add(c);

    objectAdded(c);
  }
  downTime = 0.0;
}, false);

window.addEventListener('mousemove', function(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if(lockObject != null) {
    lockObject.object.position.x = mouse.x*window.innerWidth * 0.5;
    lockObject.object.position.y = mouse.y*window.innerHeight* 0.5;
  }
}, false);


window.addEventListener('mouseup', function(event) {
  event.preventDefault();
  if(lockObject) {
    lockObject.object.position.x = mouse.x*window.innerWidth * 0.5;
    lockObject.object.position.y = mouse.y*window.innerHeight* 0.5;
    if(downTime <= 0.2) {
      objectRemoved(lockObject.object);
      objectsGroup.remove(lockObject.object);
    } else {
      objectMoved(lockObject.object, lockObjectStartingPosition);
      lockObjectStartingPosition = null;
    }
    lockObject=null;
    console.log("mouse up" + lockObject);
  }
}, false);

//
// document.addEventListener('touchstart', function(event) {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   intersects = raycaster.intersectObjects(objectsGroup.children);
//   if(intersects.length) {
//     lockObject = intersects[0];
//     lockObjectStartingPosition = new THREE.Vector2(lockObject.object.position.x, lockObject.object.position.y);
//   } else {
//     var circ = new THREE.CircleGeometry(objectSize*0.5, 32);
//     var m = new THREE.MeshBasicMaterial({color:0x000000});
//     var c = new THREE.Mesh(circ, m);
//     c.position.x = mouse.x*window.innerWidth * 0.5;
//     c.position.y = mouse.y*window.innerHeight* 0.5;
//     c.position.z = 0.0;
//     objectsGroup.add(c);
//
//     objectAdded(c);
//   }
//   downTime = 0.0;
// }, false);
//
// document.addEventListener('touchmove', function(event) {
//   // event.preventDefault();
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//
//   if(lockObject != null) {
//     lockObject.object.position.x = mouse.x*window.innerWidth * 0.5;
//     lockObject.object.position.y = mouse.y*window.innerHeight* 0.5;
//   }
// }, false);
//
// document.addEventListener('touchend', function(event) {
//   if(lockObject) {
//     lockObject.object.position.x = mouse.x*window.innerWidth * 0.5;
//     lockObject.object.position.y = mouse.y*window.innerHeight* 0.5;
//     if(downTime <= 0.2) {
//       objectRemoved(lockObject.object);
//       objectsGroup.remove(lockObject.object);
//     } else {
//       objectMoved(lockObject.object, lockObjectStartingPosition);
//       lockObjectStartingPosition = null;
//     }
//     lockObject = null;
//   }
// }, false);

window.addEventListener('resize', function() {
  camera.left   = window.innerWidth / -2;
  camera.right  = window.innerWidth /  2;
  camera.top    = window.innerHeight/  2;
  camera.bottom = window.innerHeight/ -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  socket.send(JSON.stringify({
    address: "/client/dimensions",
    args: [window.innerWidth, window.innerHeight]
  }));
}, false);

function update() {
  var d = clock.getDelta();
  if(lockObject != null) {
    downTime += d;
  }
  if(instructions.length > 0) {
    for(var i = instructions.length-1 ; i>=0 ; i-- ) {
      if(instructions[i].isDrawing) {
        instructions[i].drawingDuration -= d;
        if(instructions[i].drawingDuration <= 0.0) {
          instructionsGroup.remove(instructions[i]);
          instructions.splice(i, 1);
          console.log("instruction removed");
        } else {
          if(instructions[i].instrType==="ADD") {
            let s = THREE.Math.mapLinear(instructions[i].drawingDuration, 0.0, instructions[i].drawingTime, 1.0, 2.0);
            instructions[i].scale.set(s, s, 1.0);
          } else if(instructions[i].instrType === "REMOVE") {
            let s = THREE.Math.mapLinear(instructions[i].drawingDuration, 0.0, instructions[i].drawingTime, 2.0, 1.0);
            instructions[i].scale.set(s, s, 1.0);
          }
          let c = (instructions[i].drawingDuration/instructions[i].drawingTime);
          c = THREE.Math.clamp(Math.abs((c*2.0)-1.0), 0.0, 1.0);
          instructions[i].material.color = {
            r: c,
            g: c,
            b: 1
          };
        }
      } else {
        instructions[i].drawingDelay -= d;
        if(instructions[i].drawingDelay <= 0.0) {
          instructions[i].isDrawing = true;
          console.log("setting instruction to draw: [" + i + "]");
          console.log("type: " + instructions[i].instrType);
          instructionsGroup.add(instructions[i]);
        }
      }
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
