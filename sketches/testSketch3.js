"use strict";

import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';
import Grid from '../lib/Grid.js';

import Controls from '../lib/Controls.js';
import Snapshots from '../lib/Snapshots.js';
import Renderer from '../lib/Renderer.js';

import * as TransMatrix from '../lib/Matrix.js';

const NAME = 'CircleGrid';
const WIDTH = 300;
const HEIGHT = 300;
const SCALE = 2;

let circleControls;
let gridControls;
let timeControls;

// let renderer;

let c, l;
let rotation = new TransMatrix.Vector3();
let rx = 0;
let ry = 0;
let rz = 0;



// window.preload = function() {
// 	renderer = new Renderer(  );
// }


window.setup = function() {
	Canvas.create(
		NAME,
		WIDTH,
		HEIGHT,
		SCALE
	);

	// c = new Circle( 'circle1' );
	// l = new Line( 'line1' );

	circleControls = Controls.addGroup( 'circles' );
	circleControls.addControl( 'resolution', 4, 200, 100, 1 );
	circleControls.addControl( 'radius', 0, Canvas.width, 20, 1 );
	circleControls.addControl( 'duplicates', 0, 100, 20, 1 );
	circleControls.addControl( 'start', 0, 1, 0, 0.01 );
	circleControls.addControl( 'end', 0, 1, 0, 0.01 );
	circleControls.addControl( 'rotate', 0, 360, 0, 0.01 );
	circleControls.addControl( 'rotateY', 0, 360, 0, 0.01 );
	circleControls.addControl( 'rotateScaler', 0, 1, 1, 0.01 );
	circleControls.addControl( 'noise', 0, 1, 0, 0.01 );
	circleControls.addControl( 'freq', 0, 0.1, 0, 0.01 );
	circleControls.addControl( 'close', 0, 1, 0, 1 );

	gridControls = Controls.addGroup( 'grid' );
	gridControls.addControl( 'width', 0, Canvas.width, 1, 1 );
	gridControls.addControl( 'height', 0, Canvas.height, 1, 1 );
	gridControls.addControl( 'xres', 0, 100, 1, 1 );
	gridControls.addControl( 'yres', 0, 100, 1, 1 );
	gridControls.addControl( 'noise', 0, 100, 0, 0.1 );
	gridControls.addControl( 'freq', 0, 300, 0, 0.1 );
	
	timeControls = Controls.addGroup( 'time' );
	timeControls.addControl( 'time', 0, 1, 0, 0.01 );
	timeControls.addControl( 'loop', 0, 1, 0, 1 );


	Renderer.init( drawingContext );

	Snapshots.init( NAME );
	Snapshots.applyLatest();

}


window.draw = function() {

	if( timeControls.getValue( 'loop' ) ) {
		loop();
	} else {
		noLoop();
		Snapshots.saveLatest();
	}	

	clear();
	background(255, 243, 212); 
	noFill();

	Canvas.pushMatrix();
	Canvas.translate( width/2, height/2 );

	let grid = new Grid();
	grid.create( 
		gridControls.getValue('xres'),
		gridControls.getValue('yres'),
		gridControls.getValue('width'),
		gridControls.getValue('height'),		
	);	
	grid.center();
	
	let i = 0;
	let r = grid.vertices.length;

	const startscale = new TransMatrix.Vector3(1,1,1);
	const endscale = new TransMatrix.Vector3();
	const rotationInc = new TransMatrix.Vector3(
		noise( frameCount, 0, 0 ),
		noise( 0, frameCount, 0 ),
		noise( 0, 0, frameCount )
	);
	rx += rotationInc.x;
	ry += rotationInc.y;
	rz += rotationInc.z;

	for( let i=0; i<grid.vertices.length; i++ ) {
		const gridvert = grid.vertices[i];
		const t = i / r;
		// randomSeed(t*1000);


		let circleGrid = new Grid();
		circleGrid.create( 
			circleControls.getValue('duplicates'),
			0,
			0,
			0
		);	
		circleGrid.center();
		circleGrid.translate( gridvert );

		// let r2 = circleGrid.vertices.length;

		for( let j=0; j<circleGrid.vertices.length; j++ ) {
			const vert = grid.vertices[i];
			const t2 = j / circleGrid.vertices.length;
			// randomSeed(t2*t*1000);
			noiseSeed(i);
			const scale = TransMatrix.Vector3.lerp( startscale, endscale, t2 );			

			let myc = new Circle();
			myc.create(
				circleControls.getValue('radius'),
				circleControls.getValue('resolution'),
				new TransMatrix.Vector3(),		
				// random(0, 0.5),
				// random(0.5, 1)		
				// 0, t2
			);
			// myc.close();

			myc.scale(scale);


			myc.noiseSpherical( 
				circleControls.getValue('noise'),
				circleControls.getValue('freq'),
				frameCount * timeControls.getValue('time'),
				new TransMatrix.Vector3(
					rx, ry, rz
				)			
			);
			// myc.rotate( random(0, 1) * circleControls.getValue('rotate'));
			
			
			
			myc.translate(vert);

			myc.render();
		}

	}

	Canvas.popMatrix();


	Renderer.recordFrame();

}