"use strict";

import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';
import Grid from '../lib/Grid.js';
import Border from '../lib/Border.js';
import PolygonMask from '../lib/PolygonMask.js';
import Sine from '../lib/Sine.js';

import Controls from '../lib/Controls.js';
import Snapshots from '../lib/Snapshots.js';
// import Renderer from '../lib/Renderer.js';

import * as TransMatrix from '../lib/Matrix.js';

const NAME = 'LinesAndSines';
const WIDTH = 150;
const HEIGHT = 150;
const SCALE = 2;

// let circleControls;
let gridControls, borderControls, sineControls, maskControls;
// let timeControls;


window.setup = function() {

	Canvas.create(
		NAME,
		WIDTH,
		HEIGHT,
		SCALE
	);

	gridControls = Controls.addGroup( 'grid' );
	gridControls.addControl( 'xres', 1, 100, 1, 2 );
	gridControls.addControl( 'xoffset', -width, width, 0, 1 );

	maskControls = Controls.addGroup( 'mask' );
	maskControls.addControl( 'radius', 1, 100, 1, 1 );
	maskControls.addControl( 'resolution', 3, 360, 20, 1 );
	maskControls.addControl( 'rotation', 0, 360, 0, 1 );
	maskControls.addControl( 'noiseFreq', 0, 0.1, 0, 0.01 );
	maskControls.addControl( 'noiseAmp', 0, 1, 0, 0.1 );


	sineControls = Controls.addGroup( 'sine' );
	sineControls.addControl( 'frequency', 0, 10, 1, 1 );
	sineControls.addControl( 'offset', -1, 1, 0, 0.01 );
	sineControls.addControl( 'amplitude', 0, 100, 1, 1 );


	borderControls = Controls.addGroup( 'border' );
	borderControls.addControl( 'borderWidth', 0, 100, 20, 1 );

	// Renderer.init( drawingContext );

	Snapshots.init( NAME );
	Snapshots.applyLatest();

	noFill();

}

window.draw = function() {
	Snapshots.saveLatest();

	clear();
	stroke(0);
	background(255, 243, 212); 
	

	// let border = new Border();
	// border.create(
	// 	borderControls.getValue( 'borderWidth' )
	// );

	let grid = new Grid();
	grid.create( 
		gridControls.getValue('xres'),
		1,
		Canvas.width * 2,
		0
	);
	// grid.translate( new TransMatrix.Vector3( 
	// 	-grid.width/2,
	// 	0, 0
	// ) );
	grid.center();

	let sine = new Sine().create( 
		sineControls.getValue( 'frequency' ),
		sineControls.getValue( 'offset' ),
	);

	sine.offsetPointList( grid, sineControls.getValue( 'amplitude' ) );

	
	let circle = new Circle();
	circle.create(
		maskControls.getValue( 'radius' ),
		maskControls.getValue( 'resolution' ),
	);	
	circle.noise(
		maskControls.getValue( 'noiseAmp' ),
		maskControls.getValue( 'noiseFreq' ),
	);
	circle.rotate(
		maskControls.getValue( 'rotation' ),
	);

	let mask = new PolygonMask();
	mask.createFrom( circle );
	mask.render();
	


	for( let i=0; i<grid.vertices.length; i++ ) {
		const gridvert = grid.vertices[i];

		const line = new Line();		
		const start = TransMatrix.Vector3.add( gridvert, [0, -Canvas.height/2, 0] );
		// const end = TransMatrix.Vector3.add( start, [0, Canvas.height, 0] );
		const end = TransMatrix.Vector3.add( start, [0, Canvas.height, 0] );

		line.create( start, end, 20);
		// border.cropPointList( line );
		
		mask.maskPointList( line );
		line.render();
		// line.renderPoints();
		// break;


		
		// line.renderPoints();

	}

	// border.render();
	// mask.render();


	
}