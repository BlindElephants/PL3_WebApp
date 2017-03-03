var mouse = new THREE.Vector2();
var intersects = [];
var SceneGeom = [];
var clock = new THREE.Clock;

var lockObject = null;
var lockObjectStartingPosition = null;
var downTime = 0.0;

var objects = new THREE.Group();

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

scene.add(objects);

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
  if(lockObject) {
    if(downTime <= 0.2) {
      objectRemoved(lockObject.object);
      objects.remove(lockObject.object);
    } else {
      objectMoved(lockObject.object, lockObjectStartingPosition);
      lockObjectStartingPosition = null;
    }
    lockObject = null;
  }
}, false);

// document.addEventListener('touchstart', onDocumentTouchStart, false);

// function onDocumentTouchStart(event) {
//   if(event.touches.length === 1) {
//     // event.preventDefault();
//     var touch = {
//       x: null,
//       y: null
//     };
//     touch.x = ((event.touches[0].pageX) / window.innerWidth) * 2 - 1;
//     touch.y = -((event.touches[0].pageY) / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(touch, camera);
//
//     intersects = raycaster.intersectObjects(scene.children);
//
//     if(intersects.length) {
//       let m = {
//         address: "/user/action/",
//         args: [0, 0, 0]
//       };
//       socket.send(JSON.stringify(m));
//     }
//   }
// }

window.addEventListener('mousedown', function(event) {
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(objects.children);
  if(intersects.length) {
    // let m = {
    //   address: "/user/action/",
    //   args: [0, 0, 0]
    // };
    // socket.send(JSON.stringify(m));

    lockObject = intersects[0];
    lockObjectStartingPosition = new THREE.Vector2(lockObject.object.position.x, lockObject.object.position.y);
  } else {
    var circ = new THREE.CircleGeometry(objectSize*0.5, 32);
    var m = new THREE.MeshBasicMaterial({color:0x000000});
    var c = new THREE.Mesh(circ, m);
    c.position.x = mouse.x*window.innerWidth * 0.5;
    c.position.y = mouse.y*window.innerHeight* 0.5;
    c.position.z = 0.0;
    objects.add(c);

    objectAdded(c);
  }
  downTime = 0.0;
})


window.addEventListener('resize', function() {
  camera.left   = window.innerWidth / -2;
  camera.right  = window.innerWidth /  2;
  camera.top    = window.innerHeight/  2;
  camera.bottom = window.innerHeight/ -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);


function update() {
  var d = clock.getDelta();
  if(lockObject != null) {
    downTime += d;
  }
  if(SceneGeom.length > 0) {
    for(var i = SceneGeom.length-1 ; i>=0 ; i --) {
      if(SceneGeom[i].isDrawing) {
        SceneGeom[i].drawingDuration -= d;
        if(SceneGeom[i].drawingDuration <= 0.0) {
          scene.remove(SceneGeom[i]);
          SceneGeom.splice(i, 1);
          console.log("geom removed");
        } else {
          let s = SceneGeom[i].drawingDuration / SceneGeom[i].drawingTime;
          SceneGeom[i].scale.set(s, s, SceneGeom[i].scale.z);
        }
      } else {
        SceneGeom[i].delayDrawing -= d;
        if(SceneGeom[i].delayDrawing <= 0.0) {
          SceneGeom[i].isDrawing = true;
          console.log("setting geom to draw : [" + i + "]");
          scene.add(SceneGeom[i]);
        }
      }
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
