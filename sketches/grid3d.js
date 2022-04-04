"use strict";
import Time from '../lib/Time.js';
import Canvas from '../lib/Canvas.js';
import Shape from '../lib/Shape.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';
import Grid from '../lib/Grid.js';
import Border from '../lib/Border.js';
import PolygonMask from '../lib/PolygonMask.js';
import Sine from '../lib/Sine.js';

import Controls from '../lib/Controls.js';
import Snapshots from '../lib/Snapshots.js';
import Renderer from '../lib/Renderer.js';

import * as TransMatrix from '../lib/Matrix.js';

const NAME = 'LineCube';
const WIDTH = 150;
const HEIGHT = 150;
const SCALE = 2;

// let circleControls;
let gridControls, borderControls, sineControls, maskControls, lineControls, circleControls, lightControls, noiseControls;
let timeControls;


let grid;


window.setup = function() {

	Canvas.create(
		NAME,
		WIDTH,
		HEIGHT,
		SCALE
	);

	timeControls = Controls.addGroup('time');
	timeControls.addCheckbox( 'play', false );
	timeControls.addSlider( 'speed', 0, 2, 1, 0.01 );
	timeControls.addSlider( 'rate', 1, 120, 30, 1 );
	timeControls.addInput( 'framerate', 0 );

	gridControls = Controls.addGroup( 'grid' );
	gridControls.addSlider( 'xres', 1, 20, 1, 1 );
	gridControls.addSlider( 'yres', 1, 20, 1, 1 );
	gridControls.addSlider( 'zres', 1, 20, 1, 1 );
	gridControls.addSlider( 'width', 1, Canvas.width, 1, 2 );
	gridControls.addSlider( 'height', 1, Canvas.height, 1, 2 );
	gridControls.addSlider( 'depth', 1, Canvas.width, 1, 2 );
	gridControls.addSlider( 'rotationX', 0, 360, 0, 1 );
	gridControls.addSlider( 'rotationY', 0, 360, 0, 1 );
	gridControls.addSlider( 'rotationZ', 0, 360, 0, 1 );

	maskControls = Controls.addGroup( 'mask' );
	maskControls.addSlider( 'radius', 1, 100, 1, 1 );
	maskControls.addSlider( 'resolution', 3, 180, 20, 1 );
	maskControls.addSlider( 'rotation', 0, 360, 0, 5 );
	maskControls.addSlider( 'noiseFreq', 0, 0.1, 0, 0.01 );
	maskControls.addSlider( 'noiseAmp', 0, 1, 0, 0.01 );

	lineControls = Controls.addGroup( 'line' );
	lineControls.addSlider( 'length', 0, 50, 0, 1 );
	lineControls.addSlider( 'resolution', 3, 180, 20, 1 );
	lineControls.addSlider( 'holiness', 0, 1, 0, 0.01 );	
	

	// lightControls = Controls.addGroup( 'light' );
	// lightControls.addSlider( 'lightX', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightY', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightZ', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightIntensity', 0, 2, 1, 0.01 );

	sineControls = Controls.addGroup( 'sine' );
	sineControls.addSlider( 'frequency', 0, 10, 1, 1 );
	sineControls.addSlider( 'offset', -1, 1, 0, 0.01 );
	sineControls.addSlider( 'amplitude', 0, 10, 0, 0.01 );	

	noiseControls = Controls.addGroup( 'noise' );
	noiseControls.addSlider( 'frequency', 0, 10, 1, 1 );
	noiseControls.addSlider( 'offset', -1, 1, 0, 0.01 );
	noiseControls.addSlider( 'amplitude', 0, 10, 0, 0.01 );

	circleControls = Controls.addGroup( 'circle' );
	circleControls.addSlider( 'radius', 0, Canvas.width, 100, 1 );
	circleControls.addSlider( 'rotation', 0, 360, 0, 5 );
	circleControls.addSlider( 'holiness', 0, 1, 0, 0.01 );


	Renderer.init( drawingContext );

	Snapshots.init( NAME );
	Snapshots.applyLatest();
	timeControls.setValue( 'play', false );

	noFill();

	grid = new Grid();

}

window.draw = function() {	

	if( timeControls.getValue('play') ) {
		if( ! isLooping() ) {
			Time.play();
			loop();
		}
		timeControls.setValue( 'framerate', Time.frameRate.toFixed(2) );		
	} else {
		if( isLooping() ) {
			Time.stop();
			noLoop();			
		}		
	}

	Time.tick();
	Controls.tick();
	Snapshots.saveLatest();

	clear();
	stroke(0);
	background(255, 243, 212);	


	const axes = [
		new TransMatrix.Vector3( 1, 0, 0 ),
		new TransMatrix.Vector3( 0, 1, 0 ),
		new TransMatrix.Vector3( 0, 0, 1 ),
	];

	const size = gridControls.getValue( 'width' )

	const grid = new Grid();
	grid.create(
		gridControls.getValue( 'yres' ),
		gridControls.getValue( 'yres' ),
		gridControls.getValue( 'height' ),
		gridControls.getValue( 'height' ),
		gridControls.getValue( 'yres' ),
		gridControls.getValue( 'height' ),
	);
	grid.center();

	grid.rotate( gridControls.getValue( 'rotationZ' ), 'Z' );
	grid.rotate( gridControls.getValue( 'rotationX' ), 'X' );
	grid.rotate( gridControls.getValue( 'rotationY' ), 'Y' );

	for( const gridvert of grid.vertices ) {

		const cube = new Line();

		for( let i=0; i<3; i++ ) {
			let cubeGrid = new Grid();
			cubeGrid.create(
				gridControls.getValue( 'xres' ),
				2,
				size, size
			);

			cubeGrid.center();

			let cubeComp = new Line();

			for( let j=0; j<=cubeGrid.res.x; j++) {
				let vert1 = cubeGrid.vertices[j];
				let vert2 = cubeGrid.vertices[j + cubeGrid.res.x + 1];
				let line = new Line();
				line.create(
					TransMatrix.Vector3.add( vert1, new TransMatrix.Vector3( 0, 0, size / 2 ) ),
					TransMatrix.Vector3.add( vert2, new TransMatrix.Vector3( 0, 0, size / 2 ) ),
					lineControls.getValue( 'resolution' )
				)
				cubeComp.append( ...line.vertices );
				cubeComp.addBreak();
			}
		
			cubeComp.rotate( 90, axes[i] );
			cubeComp.rotate( 315, 'Z' );
			cubeComp.rotate( 125, 'X' );
			cubeComp.rotate( 0, 'Y' );			


			// cubeComp.rotate( gridControls.getValue( 'rotationZ' ), 'Z' );
			// cubeComp.rotate( gridControls.getValue( 'rotationX' ), 'X' );
			// cubeComp.rotate( gridControls.getValue( 'rotationY' ), 'Y' );
		
			cubeComp.noise(
				noiseControls.getValue( 'amplitude' ),
				noiseControls.getValue( 'frequency' ),
				noiseControls.getValue( 'offset' ),
			)			
			
			cubeComp.translate( new TransMatrix.Vector3(
				-gridvert.x, 
				-gridvert.y, 
				-gridvert.z, 
			) );

			cubeComp.addRandomBreaks( lineControls.getValue('holiness') );

			cubeComp.render();
		}
	}

	
}