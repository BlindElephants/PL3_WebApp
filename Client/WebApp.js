//------------THREE.js stuff setup
var container;
var geometry;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 500, theta = 0;
var frustumSize = 1000;
var intersectedIndex = -1;
var intersects = [];

init();
animate();

function init() {
  console.log("running init");

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var aspect = window.innerWidth / window.innerHeight;

  //Make camera
  //can also call (new THREE.PerspectiveCamera...)
  camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1500 );

  //Setup scene (responsible for managing assets)
  scene = new THREE.Scene();

  //add a Light
  var light = new THREE.DirectionalLight( 0x7700ff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  //Make geom
  geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

  //init Raycaster (for mouse / world collision detection)
  raycaster = new THREE.Raycaster();

  //init renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0x111111 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

}


function render() {
  //rotate that bullshit
  theta += 0.05;

  //i dunno, move the camera around a bitch
  camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
  camera.lookAt( scene.position );
  camera.updateMatrixWorld();

  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children);
}

function animate() {
  //gotta request an update on that shit son
  requestAnimationFrame(animate);

  //and then render that shizzle
  render();
}
