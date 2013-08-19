
var scene, camera, renderer, light, shadow, building, city, controls, lastTime;

init();
animate();

function init() {
	// init renderer
	renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );
	renderer.setClearColor( 0xd8e7ff );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	// setup camera
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.y = 80;
	// setup controls
	controls = new THREE.FirstPersonControls( camera );
	controls.movementSpeed = 20;
	controls.lookSpeed = 0.05;
	controls.lookVertical = true;
	// setup scene
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xd0e0f0, 0.0025 );
	// setup lighting
	light = new THREE.HemisphereLight( 0xfffff0, 0x101020, 1.25 );
	light.position.set( 0.75, 1, 0.25 );
	scene.add( light );
	// setup plane
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshBasicMaterial( { color: 0x101018 } ) );
	plane.rotation.x = - 90 * Math.PI / 180;
	scene.add( plane );
	// build geometry
	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
	geometry.faces.splice( 3, 1 );
	geometry.faceVertexUvs[0].splice( 3, 1 );
	geometry.faceVertexUvs[0][2][0].set( 0, 0 );
	geometry.faceVertexUvs[0][2][1].set( 0, 0 );
	geometry.faceVertexUvs[0][2][2].set( 0, 0 );
	geometry.faceVertexUvs[0][2][3].set( 0, 0 );
	// build city
	building = new THREE.Mesh( geometry );
	city = new THREE.Geometry();
	// lighting colors
	light = new THREE.Color( 0xffffff );
	shadow = new THREE.Color( 0x303050 );
	// generate city mesh
	for( var i = 0; i < 20000; i++ ){

		var value = 1 - Math.random() * Math.random();
		var color = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );

		var top = color.clone().multiply( light );
		var bottom = color.clone().multiply( shadow );

		building.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
		building.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;
		building.rotation.y = Math.random();// * Math.PI * 2;
		building.scale.x = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
		building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8;
		building.scale.z = building.scale.x;


		var geometry2 = building.geometry;
		for ( var j = 0, jl = geometry2.faces.length; j < jl; j++ ) {

			if ( j === 2 ) {

				geometry2.faces[ j ].vertexColors = [ color, color, color, color ];

			} else {

				geometry2.faces[ j ].vertexColors = [ top, bottom, bottom, top ];
			}
		}

		THREE.GeometryUtils.merge( city, building );
	}

	// generate texture
	var texture = new THREE.Texture( generateTexture() );
	texture.anisotropy = renderer.getMaxAnisotropy();
	texture.needsUpdate = true;

	// build mesh
	var mesh = new THREE.Mesh( city, new THREE.MeshLambertMaterial({
		map: texture,
		vertexColors: THREE.VertexColors
	}));
	//return mesh;
	scene.add( mesh );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.left = '0';
	info.style.top = '15px';
	info.style.width = '100%';
	info.style.color = 'rgba(0,0,64,0.5)';
	info.style.textAlign = 'center';
	info.textContent = 'click and hold to move forward';
	document.body.appendChild( info );

	lastTime = performance.now();
}

function generateTexture(){

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = 64;

	var context = canvas.getContext( '2d' );
	context.fillStyle = '#ffffff';
	context.fillRect( 0, 0, 32, 64 );

	for( var y = 2; y < 64; y += 2 ){
		for( var x = 0; x < 32; x += 2 ){
			var value2 = Math.floor( Math.random() * 64 );
			context.fillStyle = 'rgb(' + [value2, value2, value2].join( ',' ) + ')';
			context.fillRect( x, y, 2, 1 );
		}
	}

	var canvas2 = document.createElement( 'canvas' );
	canvas2.width = 512;
	canvas2.height = 1024;

	var context2 = canvas2.getContext( '2d' );
	context2.imageSmoothEnabled = false;
	context2.webkitImageSmoothingEnabled = false;
	context2.mozImageSmoothingEnabled = false;
	context2.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );

	return canvas2;
}

function animate() {

	requestAnimationFrame( animate );
	
	var time = performance.now() / 1000;
	controls.update( time - lastTime );
	renderer.render( scene, camera );

	lastTime = time;
}
