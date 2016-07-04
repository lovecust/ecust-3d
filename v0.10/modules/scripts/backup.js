function features() {
	effect = new THREE.AnaglyphEffect( renderer );
	effect.setSize( width, height );
}


function customSinCurve() {
	var CustomSinCurve = THREE.Curve.create(
		function ( scale ) { //custom curve constructor
			this.scale = (scale === undefined) ? 1 : scale;
		},

		function ( t ) { //getPoint: t is between 0-1
			var tx = t * 5,
				ty = 9*t*t*t,
				tz = 0;

			return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
		}
	);

	var path = new CustomSinCurve( 100 );

	var geometry = new THREE.TubeGeometry(
		path,  //path
		20,    //segments
		1,     //radius
		8,     //radiusSegments
		true  //closed
	);
	var rectMesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;

	scene.add( rectMesh );
}

function shape() {
	var rectLength = 120, rectWidth = 40;

	var rectShape = new THREE.Shape();
	rectShape.moveTo( 0,0 );
	rectShape.lineTo( 0, rectWidth );
	rectShape.lineTo( rectLength, rectWidth );
	rectShape.lineTo( rectLength, 0 );
	rectShape.lineTo( 0, 0 );

	var rectGeom = new THREE.ShapeGeometry( rectShape );
	var rectMesh = new THREE.Mesh( rectGeom, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;

	scene.add( rectMesh );
}