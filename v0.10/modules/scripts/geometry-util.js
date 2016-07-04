function initGroup( obj ) {
	if ( !obj || false === obj.visible )
		return;
	log( 'initializing group: ' + obj.name );

	var group = new THREE.Group();
	group.position.x = obj.position.x;
	group.position.y = obj.position.y;
	group.position.z = obj.position.z;

	if ( obj.rotation ) {
		group.rotation.x = obj.rotation.x;
		group.rotation.y = obj.rotation.y;
		group.rotation.z = obj.rotation.z;
	}

	initGroupEntities( group, obj.entities );

	scene.add( group );
}

function initGroupEntities( group, entities ) {
	var entity;
	for ( var i = 0; i < entities.length; i++ ) {
		var obj = entities[ i ];
		switch ( obj.type ) {
			case 'rectangle':
				entity = initRectangle( obj );
				break;
			case 'plane':
				entity = initPlane( obj );
				break;
			case 'line':
				entity = initLine( obj );
				break;
			case 'text':
				entity = initText( obj );
				break;
			case 'road':
				entity = initRoads( obj );
				break;
			case 'model':
				entity = initModel( obj );
				break;
			default:
				log( 'Object is unknown with the type: ' + obj.type );
				entity = null;
				break;
		}
		if ( Array.isArray( entity ) )
			for ( var j = 0; j < entity.length; j++ ) {
				group.add( entity[ j ] );
			}
		else
			group.add( entity );
	}
}
function initRectangle( obj, model ) {
	if ( !obj || false === obj.visible )
		return;
	if ( model && false === model.visible )
		return;
	var geometry, material, cube;
	if ( Array.isArray( obj ) && model ) {
		geometry = new THREE.BoxGeometry( model.size.x, model.size.y, model.size.z );
		material = getMaterial( model );
		cube = new THREE.Mesh( geometry, material );
		cube.position.x = obj[ 0 ];
		cube.position.y = obj[ 1 ];
		cube.position.z = obj[ 2 ] + model.size.z / 2;
		return cube;
	} else {
		if ( obj.size )
			geometry = new THREE.BoxGeometry( obj.size.x, obj.size.y, obj.size.z );
		else
			geometry = new THREE.BoxGeometry( model.size.x, model.size.y, model.size.z );
		material = getMaterial( obj );

		cube = new THREE.Mesh( geometry, material );
		cube.position.x = obj.position.x;
		cube.position.y = obj.position.y;
		cube.position.z = obj.position.z + obj.size.z / 2;
		return cube;
	}
}


function initModel( obj ) {
	if ( !obj || false === obj.visible )
		return;
	var model = ecust.getModel( obj.model );
	var entities = obj.entities;
	if ( !model )
		return;
	var cubes = [];
	for ( var i = 0; i < entities.length; i++ ) {
		var entity = entities[ i ];
		cubes.push( initRectangle( entities[ i ], model ) );
	}
	return cubes;
}

function initPlane( obj ) {
	var geometry = new THREE.PlaneGeometry( obj.size.x, obj.size.y );
	var material = getMaterial( obj );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.x = obj.position.x;
	plane.position.y = obj.position.y;
	plane.position.z = obj.position.z;
	return plane;
}

function initLine( obj ) {
	var triangleShape = new THREE.Shape();
	triangleShape.moveTo( 80, 20 );
	triangleShape.lineTo( 40, 80 );
	triangleShape.lineTo( 120, 80 );
	triangleShape.lineTo( 80, 20 ); // close path
	var geometry = triangleShape.createPointsGeometry();
	geometry.vertices.push( geometry.vertices[ 0 ].clone() );

	var material = new THREE.LineBasicMaterial( { linewidth: 100, color: obj.color } );
	// var geometry = new THREE.Geometry();
	// for (var i = 0; i < obj.vertices.length; i += 3) {
	// 	geometry.vertices.push(new THREE.Vector3(obj.vertices[i], obj.vertices[i + 1], obj.vertices[i + 2]));
	// }
	return new THREE.Line( geometry, material );
}

/*
 * obj + model desire color<int>, vertices<array>, width<int>
 * obj + model require color<int>, vertices<array>
 * obj requires vertices<array>
 * */
function initLine2( obj, model ) {
	var line = new THREE.MeshLine();
	line.setGeometry( obj.vertices );
	if ( model ) {
		if ( !obj.color )
			obj.color = model.color;
		if ( !obj.width )
			obj.width = model.width;
		if ( !obj.width )
			obj.width = 1;
	}
	var material = new THREE.MeshLineMaterial( {
		useMap: false,
		color: new THREE.Color( obj.color ),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: true,
		lineWidth: obj.width,
		near: camera.near,
		far: camera.far
	} );
	return new THREE.Mesh( line.geometry, material );
}
function initLine3( obj, model ) {
	var line = new THREE.MeshLine();
	line.setGeometry( obj.vertices );
	if ( model ) {
		if ( !obj.color )
			obj.color = model.color;
		if ( !obj.width )
			obj.width = model.width || 1;
	}
	var material = new THREE.MeshLineMaterial( {
		useMap: false,
		color: new THREE.Color( obj.color ),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: true,
		lineWidth: obj.width,
		near: camera.near,
		far: camera.far
	} );
	return new THREE.Line( line.geometry, material );
}
/*
 * obj + model desire color<int>, vertices<array>, width<float>=10, height<float>=0.1
 * obj requires vertices<array>
 * */
function initRoads( obj ) {
	var entities = [];
	for ( var i = 0; i < obj.vertices.length; i++ ) {
		obj.points = getVector3( obj.vertices[ i ] );
		entities.push( initRoad( obj ) );
	}
	return entities;
}
function initRoad( obj ) {
	var model;
	model = ecust.getModel( obj.model );
	if ( !model )
		model = {};
	var width = obj.width || model.width || 10;
	var height = obj.height || model.height || 0.1;

	var path;
	if ( obj.type === 'road-bent' )
		path = new THREE.CatmullRomCurve3( obj.points );
	else
		path = new THREE.DirectCurve( obj.points );
	var extrudeSettings = {
		steps: 100,
		amount: 10,
		bevelEnabled: false,
		bevelThickness: 1.0,
		bevelSize: 1.0,
		extrudePath: path
	};
	var material = getMaterial( obj, model );
	var triangleShape = new THREE.Shape();
	triangleShape.moveTo( 0, 0 );
	triangleShape.lineTo( 0, width );
	triangleShape.lineTo( height, width );
	triangleShape.lineTo( height, 0 );
	triangleShape.lineTo( 0, 0 );
	var geometry = new THREE.ExtrudeGeometry( triangleShape, extrudeSettings );
	return new THREE.Mesh( geometry, material );
}


var font;
function initText( obj ) {
	var bevelThickness = 0.5,
		curveSegments = 4,
		bevelSize = 0.02,
		bevelSegments = 0.02,
		bevelEnabled = true;
	var textGeo = new THREE.TextGeometry( obj.text, {
		font: font,
		size: obj.size,
		height: obj.height,
		curveSegments: curveSegments,
		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled,
		material: 0,
		extrudeMaterial: 1
	} );
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();
	var material = new THREE.MultiMaterial( [
		new THREE.MeshPhongMaterial( { color: obj.color, shading: THREE.FlatShading } ), // front
		new THREE.MeshPhongMaterial( { color: obj.color, shading: THREE.SmoothShading } ) // side
	] );

	var textMesh = new THREE.Mesh( textGeo, material );
	textMesh.position.x = obj.position.x;
	textMesh.position.y = obj.position.y;
	textMesh.position.z = obj.position.z;
	textMesh.rotation.x = Math.PI / 2;
	return textMesh;
}

function initXYZ() {
	// draw the different color
	var grid = new THREE.GridHelper( 1000, 5.0, 0xffffff, 0x555555 );
	grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI / 180 ) );
	scene.add( grid );
	// draw x,y,z line
	var materialX = new THREE.LineBasicMaterial( {
		color: 0xff0000,
		linewidth: 1000
	} );

	var geometryX = new THREE.Geometry();
	geometryX.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 10000, 0, 0 )
	);
	var lineX = new THREE.Line( geometryX, materialX );
	scene.add( lineX );
	var materialY = new THREE.LineBasicMaterial( {
		color: 0x00ff00
	} );

	var geometryY = new THREE.Geometry();
	geometryY.vertices.push(
		new THREE.Vector3( 0, -0, 0 ),
		new THREE.Vector3( 0, 10000, 0 )
	);
	var lineY = new THREE.Line( geometryY, materialY );
	scene.add( lineY );
	var materialZ = new THREE.LineBasicMaterial( {
		color: 0x0000ff
	} );
	var geometryZ = new THREE.Geometry();
	geometryZ.vertices.push(
		new THREE.Vector3( 0, 0, -0 ),
		new THREE.Vector3( 0, 0, 10000 )
	);
	var lineZ = new THREE.Line( geometryZ, materialZ );
	scene.add( lineZ );
}

function addStatic( parent, child ) {

	child.matrixAutoUpdate = false;
	child.updateMatrix();

	parent.add( child );

}
function getVector3( vertices ) {
	if ( !vertices || !vertices instanceof Array )
		return;
	var points = [];
	for ( var i = 0; i < vertices.length; i += 3 ) {
		points.push( new THREE.Vector3( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] ) );
	}
	return points;
}
var loaderTexture, loaderCubeTexture;
function getMaterial( obj, model ) {
	// new THREE.MeshBasicMaterial({
	// 	map: (new THREE.TextureLoader).load(.surface)
	// });
	var material, texture;
	if ( !loaderCubeTexture ) {
		loaderCubeTexture = new THREE.CubeTextureLoader();
		loaderCubeTexture.setPath( 'modules/images/' );
	}
	if ( !loaderTexture ) {
		loaderTexture = new THREE.TextureLoader();
		loaderTexture.setPath( 'modules/images/' );
	}
	if ( !model )
		model = {};
	var color = obj.color || model.color;
	var surface = obj.surface || model.surface;
	var surfaces = obj.surfaces || model.surfaces;

	if ( surfaces )
		surface = surfaces[ 0 ];
	if ( color ) {
		material = new THREE.MeshBasicMaterial( { color: color } );
	} else if ( surface ) {
		texture = loaderTexture.load( surface );
		material = new THREE.MeshBasicMaterial( { map: texture } );
	} else if ( surfaces ) {
		texture = loaderCubeTexture.load( surfaces );
		material = new THREE.MeshBasicMaterial( { color: 0xff00ff, envMap: texture } );
	} else {
		material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	}
	return material;
}
var lichKing;
function initLichKing() {
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	var loader = new THREE.OBJLoader();
	var texture = new THREE.Texture();
	loader.load( '//cdn.lovecust.com/models/3d/lich-king/Lich_King.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		} );
		object.scale.multiplyScalar( 80 );
		object.rotation.x = Math.PI/2;
		object.rotation.y = -Math.PI/4;

		object.position.x = 150000;
		object.position.y = 150000;
		object.position.z = 150000;
		lichKing  = object;
		scene.add( object );
	}, onProgress, onError );
}
var jeep;
function initJeep() {
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	// Load jeep model using the AssimpJSONLoader
	var loader1 = new THREE.AssimpJSONLoader();
	loader1.load( '//cdn.lovecust.com/models/3d/jeep.assimp.json', function ( object ) {
		object.scale.multiplyScalar( 2 );
		object.rotation.x = Math.PI / 2;
		object.position.x = 100;
		object.position.y = -300;
		jeep = object;
		scene.add( object );
	}, onProgress, onError );
}

function initCustomUtils() {
	THREE.DirectCurve = THREE.Curve.create(
		function ( points /* array of Vector3 */ ) {
			console.warn( 'THREE.SplineCurve3 will be deprecated. Please use THREE.CatmullRomCurve3' );
			this.points = ( points == undefined ) ? [] : points;
		},
		function ( t ) {
			var points = this.points;
			var offset = ( points.length - 1 ) * t;
			var index = Math.floor( offset );
			offset -= index;
			var p = points[ index ];
			var pn = points[ index + 2 > points.length ? points.length - 1 : index + 1 ];
			return new THREE.Vector3( (pn.x - p.x) * offset + p.x, (pn.y - p.y) * offset + p.y, (pn.z - p.z) * offset + p.z );
		}
	);
	setTimeout(function () {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-77912213-1', 'auto');ga('send', 'pageview');
	}, 4000);
}
