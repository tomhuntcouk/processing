import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';
import Grid from '../lib/Grid.js';

import Controls from '../lib/Controls.js';
import Snapshots from '../lib/Snapshots.js';

import * as TransMatrix from '../lib/Matrix.js';

let circleControls;
let gridControls;
let timeControls;

let c, l;
let rotation = new TransMatrix.Vector3();
let rx = 0;
let ry = 0;
let rz = 0;

window.setup = function() {
	Canvas.create(
		150,
		150,
		2
	);

	// c = new Circle( 'circle1' );
	// l = new Line( 'line1' );

	circleControls = Controls.addGroup( 'circles' );
	circleControls.addControl( 'radius', 0, width, 20, 1 );
	circleControls.addControl( 'start', 0, 1, 0, 0.01 );
	circleControls.addControl( 'end', 0, 1, 0, 0.01 );
	circleControls.addControl( 'rotate', 0, 360, 0, 0.01 );
	circleControls.addControl( 'rotateY', 0, 360, 0, 0.01 );
	circleControls.addControl( 'noise', 0, 1, 0, 0.01 );
	circleControls.addControl( 'freq', 0, 0.1, 0, 0.01 );

	gridControls = Controls.addGroup( 'grid' );
	gridControls.addControl( 'width', 0, width, 1, 1 );
	gridControls.addControl( 'height', 0, height, 1, 1 );
	gridControls.addControl( 'xres', 0, 100, 1, 1 );
	gridControls.addControl( 'yres', 0, 100, 1, 1 );
	gridControls.addControl( 'noise', 0, 100, 0, 0.1 );
	gridControls.addControl( 'freq', 0, 300, 0, 0.1 );
	
	timeControls = Controls.addGroup( 'time' );
	timeControls.addControl( 'time', 0, 10, 0, 0.01 );
	timeControls.addControl( 'loop', 0, 1, 0, 1 );

	Snapshots.init( 'Test1' );
	Snapshots.applyLatest();

}


window.draw = function() {

	if( timeControls.getValue( 'loop' ) ) {
		loop();
	} else {
		noLoop();
	}

	Snapshots.saveLatest();

	clear();
	background(255, 243, 212); 
	noFill();

	Canvas.pushMatrix();
	// Canvas.translate( -width/2, -height/2 );

	let grid = new Grid();
	grid.create( 
		gridControls.getValue('xres'),
		gridControls.getValue('yres'),
		gridControls.getValue('width'),
		gridControls.getValue('height'),		
	);	
	grid.center();
	// grid.noise(
	// 	gridControls.getValue( 'noise' ),
	// 	gridControls.getValue( 'freq' ),
	// 	gridControls.getValue( 'time' )
	// );

	
	let i = 0;
	let r = grid.vertices.length;

	let startscale = new TransMatrix.Vector3(1,1,1);
	let endscale = new TransMatrix.Vector3();

	const rotationInc = new TransMatrix.Vector3(
		noise( frameCount, 0, 0 ),
		noise( 0, frameCount, 0 ),
		noise( 0, 0, frameCount )
	);
	rx += rotationInc.x;
	ry += rotationInc.y;
	rz += rotationInc.z;


	// for( let vert of grid.vertices ) {
	for( let i=1; i<grid.vertices.length; i++ ) {
		let vert = grid.vertices[i];

		let t = i / r;

		let myc = new Circle();
		myc.create(
			circleControls.getValue('radius'),
			150,
			new TransMatrix.Vector3(),
			circleControls.getValue('start'),
			circleControls.getValue('end')
		);
		myc.close();
			

		// myc.rotate( random() * circleControls.getValue('rotate') );
		let scale = TransMatrix.Vector3.lerp( startscale, endscale, t );
		myc.scale( scale );
		myc.translate( vert );
		

		myc.rotate( circleControls.getValue('rotateY'), 'Y' );

		myc.noiseSpherical( 
			circleControls.getValue('noise'),
			circleControls.getValue('freq'),
			timeControls.getValue('time'),
			new TransMatrix.Vector3(
				rx, ry, rz
			)
		);

		// myc.rotate( -circleControls.getValue('rotateY'), 'Y' );

		myc.render();

		i++;
	}


	// l.create( 
	// 	new TransMatrix.Vector3( 0, 0 ),
	// 	new TransMatrix.Vector3( width, height ),
	// 	20
	// );
	// l.render();

	Canvas.popMatrix();

	// c.create(
	// 	c.controls.getValue('radius'),		
	// 	c.controls.getValue('resolution'),
	// 	new TransMatrix.Vector3(),
	// 	c.controls.getValue('start'),
	// 	c.controls.getValue('end')
	// );

	// c.rotate( c.controls.getValue('rotate'), 'Y' );

	// c.noise( 
	// 	controls.getValue('noise'),
	// 	controls.getValue('freq'),
	// 	controls.getValue('time')
	// );
	

	// c.render();

	

}