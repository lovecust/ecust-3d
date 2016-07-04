initCustomUtils();
if ( !Detector.webgl )
	Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var config = {
	isTrackballControls: true,
	isCameraControls: false,
	isPointerLockControls: false
};
var trackballControls;
var cameraControls;
var pointerLockControls;
var mPCConfig = {
	controlsEnabled: false,
	moveForward: false,
	moveBackward: false,
	moveLeft: false,
	moveRight: false,
	canJump: false,
	stepMove: 100.0,
	stepJump: 200.0,
	gravity: 9.8 * 250.0,
	fastRate: 2.0,
	fastTime: 10 * 1000,
	cameraHeight: 1.8
};
var raycaster;
var velocity = new THREE.Vector3();


var clock = new THREE.Clock();
var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

function onPageLoaded() {
	init();
	animate();
}

function isPointerAvailable() {
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
		return false;
	}
	return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
}
function addPointerListener() {
	if ( isPointerAvailable() ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				mPCConfig.controlsEnabled = true;
				pointerLockControls.enabled = true;
				log( "pointerlockchange()-> blocker.style.display = 'none'" );
			} else {
				pointerLockControls.enabled = false;
				log( "pointerlockchange()-> instructions.style.display = '';" );
			}
		};

		var pointerlockerror = function ( event ) {
			log( "pointerlockerror() -> instructions.style.display = '';" );
			log( event );
		};
		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	} else {
		log( 'Your browser doesn\'t seem to support Pointer Lock API' );
	}
}
function init() {
	if ( isPointerAvailable() ) {
		config.isPointerLockControls = true;
		config.isTrackballControls = false;
	}
	container = document.getElementById( "container" );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 10000 );
	// camera.position.set(100, -100, 200);

	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
	scene.add( camera );

	// light
	var dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( 200, 200, 1000 ).normalize();
	camera.add( dirLight );
	camera.add( dirLight.target );

	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	if ( config.isTrackballControls ) {
		// init controller
		camera.position.set( 100, -100, 200 );
		trackballControls = new THREE.TrackballControls( camera );
		trackballControls.rotateSpeed = 5.0;
		trackballControls.zoomSpeed = 5;
		trackballControls.panSpeed = 2;
		trackballControls.noZoom = false;
		trackballControls.noPan = false;
		trackballControls.staticMoving = true;
		trackballControls.dynamicDampingFactor = 0.3;
	}
	if ( config.isCameraControls ) {
		cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
		cameraControls.target.set( 0, 50, 0 );
	}
	if ( config.isPointerLockControls ) {
		addPointerListener();
		pointerLockControls = new THREE.PointerLockControls( camera );
		scene.add( pointerLockControls.getObject() );
		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 100 );
		document.addEventListener( 'keydown', mPCConfig.onKeyDown, false );
		document.addEventListener( 'keyup', mPCConfig.onKeyUp, false );
	}


	var loader = new THREE.FontLoader();
	loader.load( '//cdn.lovecust.com/fonts/3d/optimer_bold.typeface.json', function ( response ) {
		font = response;
		test();
		initSpace();
	} );

	// record the state
	stats = new Stats();
	container.appendChild( stats.dom );
	window.addEventListener( 'resize', onWindowResize, false );
	log( 'ThreeJs is initialized now!' );
}

function initSpace() {
	var groups = ecust.groups;
	log( 'initializing project: ' + ecust.name + ' with groups: ' + groups.length );
	initXYZ();
	for ( var i = 0; i < groups.length; i++ ) {
		initGroup( groups[ i ] );
	}
}
function test() {
	initJeep();
	initLichKing();
}

function animate() {
	requestAnimationFrame( animate );
	render();
	renderer.render( scene, camera );
	stats.update();
}

function render() {
	var delta = clock.getDelta();
	if ( config.isCameraControls )
		cameraControls.update( delta );
	if ( config.isTrackballControls )
		trackballControls.update( delta );
	if ( config.isPointerLockControls && mPCConfig.controlsEnabled ) {
		raycaster.ray.origin.copy( pointerLockControls.getObject().position );
		raycaster.ray.origin.z -= 1;
		// var intersections = raycaster.intersectObjects(objects);
		// var isOnObject = intersections.length > 0;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.y -= velocity.y * 10.0 * delta;
		velocity.z -= mPCConfig.gravity * delta; // 100.0 = mass

		if ( mPCConfig.moveForward ) velocity.y += mPCConfig.stepMove * delta;
		if ( mPCConfig.moveBackward ) velocity.y -= mPCConfig.stepMove * delta;
		if ( mPCConfig.moveLeft ) velocity.x -= mPCConfig.stepMove * delta;
		if ( mPCConfig.moveRight ) velocity.x += mPCConfig.stepMove * delta;
		if ( (+new Date()) % 2 == 0 ) {
			velocity.z = Math.max( 0, velocity.z );
			mPCConfig.canJump = true;
		}

		pointerLockControls.getObject().translateX( velocity.x * delta );
		pointerLockControls.getObject().translateY( velocity.y * delta );
		pointerLockControls.getObject().translateZ( velocity.z * delta );
		if ( pointerLockControls.getObject().position.z < mPCConfig.cameraHeight ) {
			velocity.z = 0;
			pointerLockControls.getObject().position.z = mPCConfig.cameraHeight;
			mPCConfig.canJump = true;
		}

		if ( jeep ) {
			jeep.position.x = velocity.x + 200;
			jeep.position.y = velocity.y + 200;
			jeep.position.z = velocity.z;
		}
	}
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	if ( config.isTrackballControls )
		trackballControls.handleResize();
	log( "Resize the window!" );
}


function faster() {
	mPCConfig.stepMove *= mPCConfig.fastRate;
	mPCConfig.stepJump *= mPCConfig.fastRate;
	mPCConfig.gravity *= mPCConfig.fastRate;
	var slower = function () {
		mPCConfig.stepMove /= mPCConfig.fastRate;
		mPCConfig.stepJump /= mPCConfig.fastRate;
		mPCConfig.gravity /= mPCConfig.fastRate;
	};
	setTimeout( slower, mPCConfig.fastTime );
}

function doSomethingFunny() {
	lichKing.position.set( -100, 100, 0 );
}
var trick = {
	keyCache: '',
	isProcessed: false
};
mPCConfig.onKeyDown = function ( event ) {
	trick.isProcessed = true;
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			mPCConfig.moveForward = true;
			break;
		case 37: // left
		case 65: // a
			mPCConfig.moveLeft = true;
			break;
		case 40: // down
		case 83: // s
			mPCConfig.moveBackward = true;
			break;
		case 39: // right
		case 68: // d
			mPCConfig.moveRight = true;
			break;
		case 32: // space
			if ( mPCConfig.canJump === true ) velocity.z += mPCConfig.stepJump;
			mPCConfig.canJump = false;
			break;
		case 70:
			faster();
			break;
		case 13:
		case 72:
			camera.position.set( 0, 0, 0 );
			camera.rotation.set( 0, 0, 0 );
			var element = document.body;
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			if ( /Firefox/i.test( navigator.userAgent ) ) {
				var fullscreenchange = function ( event ) {
					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
						element.requestPointerLock();
					}
				};
				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
				element.requestFullscreen();
			} else {
				element.requestPointerLock();
				log( 'element.requestPointerLock();' );
			}
			break;
		default:
			trick.isProcessed = false;
			trick.keyCache += String.fromCharCode( event.keyCode );
			if ( trick.keyCache === 'PIG' )
				doSomethingFunny();
			break;
	}
	if ( trick.isProcessed )
		trick.keyCache = '';
};
mPCConfig.onKeyUp = function ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			mPCConfig.moveForward = false;
			break;
		case 37: // left
		case 65: // a
			mPCConfig.moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			mPCConfig.moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			mPCConfig.moveRight = false;
			break;
	}
};

function log( msg ) {
	console.log( msg );
	return msg;
}