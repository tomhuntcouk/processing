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
let gridControls, borderControls, sineControls, maskControls, lineControls, circleControls;
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
	// gridControls.addControl( 'xoffset', -width, width, 0, 1 );

	maskControls = Controls.addGroup( 'mask' );
	maskControls.addControl( 'radius', 1, 100, 1, 1 );
	maskControls.addControl( 'resolution', 3, 180, 20, 1 );
	maskControls.addControl( 'rotation', 0, 360, 0, 5 );
	maskControls.addControl( 'noiseFreq', 0, 0.1, 0, 0.01 );
	maskControls.addControl( 'noiseAmp', 0, 1, 0, 0.01 );

	lineControls = Controls.addGroup( 'line' );
	lineControls.addControl( 'resolution', 3, 180, 20, 1 );
	lineControls.addControl( 'holiness', 0, 1, 0, 0.01 );

	circleControls = Controls.addGroup( 'circle' );
	circleControls.addControl( 'radius', 0, Canvas.width, 100, 1 );
	circleControls.addControl( 'rotation', 0, 360, 0, 5 );
	circleControls.addControl( 'holiness', 0, 1, 0, 0.01 );

	sineControls = Controls.addGroup( 'sine' );
	sineControls.addControl( 'frequency', 0, 10, 1, 1 );
	sineControls.addControl( 'offset', -1, 1, 0, 0.01 );
	sineControls.addControl( 'amplitude', 0, 10, 0, 0.01 );


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

	
	let maskPoly = new Circle();
	maskPoly.create(
		maskControls.getValue( 'radius' ),
		maskControls.getValue( 'resolution' ),
	);	
	maskPoly.noise(
		maskControls.getValue( 'noiseAmp' ),
		maskControls.getValue( 'noiseFreq' ),
	);
	maskPoly.rotate(
		maskControls.getValue( 'rotation' ),
	);

	let mask = new PolygonMask();
	mask.createFrom( maskPoly );
	mask.render();
	

	for( let i=0; i<grid.vertices.length; i++ ) {
		const gridvert = grid.vertices[i];

		const line = new Line();		
		const start = TransMatrix.Vector3.add( gridvert, [0, -Canvas.height/2, 0] );
		const end = TransMatrix.Vector3.add( start, [0, Canvas.height, 0] );

		line.create( start, end, 
			lineControls.getValue('resolution')
		);		

		mask.maskPointList( line );
		line.addRandomBreaks( lineControls.getValue('holiness') );
		line.render();
		// line.renderPoints();
		
	}

	let circle = new Circle();
	circle.create(
		circleControls.getValue('radius'),
		360
	);	
	circle.addRandomBreaks( 
		circleControls.getValue('holiness')
	);
	circle.rotate( 
		circleControls.getValue('rotation')
	);
	circle.render();


	
}