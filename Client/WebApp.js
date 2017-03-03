var mouse = new THREE.Vector2(), INTERSECTED;
var intersectedIndex = -1;
var intersects = [];
var objectSize = window.innerHeight*0.1;
var SceneGeom = [];
var clock = new THREE.Clock;

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

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('touchstart', onDocumentTouchStart, false);

function onDocumentTouchStart(event) {
  if(event.touches.length === 1) {
    // event.preventDefault();
    var touch = {
      x: null,
      y: null
    };
    touch.x = ((event.touches[0].pageX) / window.innerWidth) * 2 - 1;
    touch.y = -((event.touches[0].pageY) / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(touch, camera);

    intersects = raycaster.intersectObjects(scene.children);

    if(intersects.length) {
      let m = {
        address: "/user/action/",
        args: [0, 0, 0]
      };
      socket.send(JSON.stringify(m));
    }
  }
}

window.addEventListener('mousedown', function(event) {
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children);
  if(intersects.length) {
    let m = {
      address: "/user/action/",
      args: [0, 0, 0]
    };
    socket.send(JSON.stringify(m));
  }
})


window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
  var d = clock.getDelta();
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
