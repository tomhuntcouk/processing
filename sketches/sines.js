"use strict";
import Time from '../lib/Time.js';
import Canvas from '../lib/Canvas.js';
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

const NAME = 'LinesAndSines';
const WIDTH = 150;
const HEIGHT = 150;
const SCALE = 1;

// let circleControls;
let gridControls, borderControls, sineControls, maskControls, lineControls, circleControls, lightControls;
let timeControls;


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
	gridControls.addSlider( 'xres', 1, 100, 1, 2 );
	gridControls.addSlider( 'yres', 1, 100, 1, 2 );	
	gridControls.addSlider( 'rotation', 0, 360, 0, 1 );
	gridControls.addSlider( 'scale', 0, 2, 1, 0.1 );

	maskControls = Controls.addGroup( 'mask' );
	maskControls.addSlider( 'radius', 1, 100, 1, 1 );
	maskControls.addSlider( 'resolution', 3, 180, 20, 1 );
	maskControls.addSlider( 'rotation', 0, 360, 0, 5 );
	maskControls.addSlider( 'noiseFreq', 0, 0.1, 0, 0.01 );
	maskControls.addSlider( 'noiseAmp', 0, 1, 0, 0.01 );
	maskControls.addSlider( 'offset', -100, 100, 0, 1 );
	maskControls.addCheckbox( 'outline', false );


	lineControls = Controls.addGroup( 'line' );
	lineControls.addSlider( 'resolution', 3, 180, 20, 1 );
	lineControls.addSlider( 'holiness', 0, 1, 0, 0.01 );	
	lineControls.addSlider( 'noiseOffsetY', 0, Canvas.height, 0, 0.1 );

	// lightControls = Controls.addGroup( 'light' );
	// lightControls.addSlider( 'lightX', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightY', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightZ', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightIntensity', 0, 2, 1, 0.01 );

	sineControls = Controls.addGroup( 'sine' );
	sineControls.addSlider( 'frequency', 0, 10, 1, 1 );
	sineControls.addSlider( 'offset', -1, 1, 0, 0.01 );
	sineControls.addSlider( 'amplitude', 0, 10, 0, 0.01 );	


	Renderer.init( drawingContext );

	Snapshots.init( NAME );
	Snapshots.applyLatest();

	noFill();

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

	let linesList = []


	const hgrid = new Grid();
	hgrid.create(
		gridControls.getValue( 'xres' ),
		2,
		Canvas.width * 2,
		Canvas.height
	);
	hgrid.center();

	const sine = new Sine();
	sine.create(
		sineControls.getValue( 'frequency' ),
		sineControls.getValue( 'offset' ),
	);
	sine.offsetPointList(
		hgrid,
		sineControls.getValue( 'amplitude' )
	);

	
	const circle = new Circle();
	circle.create(
		maskControls.getValue( 'radius' ),
		maskControls.getValue( 'resolution' )		
	);
	circle.rotate( maskControls.getValue( 'rotation' ) );
	circle.translate( new TransMatrix.Vector3(
		0,
		maskControls.getValue( 'offset' ),
		0
	) );

	const mask = new PolygonMask();
	mask.createFrom(
		circle
	);

	hgrid.rotate( gridControls.getValue( 'rotation' ) );
	hgrid.scale(
		new TransMatrix.Vector3(
			gridControls.getValue( 'scale' ),
			gridControls.getValue( 'scale' ),
			gridControls.getValue( 'scale' )
		)
	);

	for( let i=0; i<hgrid.resolution.x; i+=hgrid.resolution.y ) {
		const line = new Line();		
		line.create(
			hgrid.vertices[i],
			hgrid.vertices[i + hgrid.resolution.y + hgrid.resolution.x]
		);
		mask.maskPointList( line );

		if( line.resolution < 1 ) {
			continue;
		}

		line.render();

		const canvasVert1 = Canvas.applyMatrix( line.vertices[1] );
		const canvasVert2 = Canvas.applyMatrix( line.vertices[2] );

		canvasVert1.add( new TransMatrix.Vector3( Canvas.width/2, Canvas.height/2 ) );
		canvasVert2.add( new TransMatrix.Vector3( Canvas.width/2, Canvas.height/2 ) );

		linesList.push( [
			[ ((canvasVert2[0]/10).toFixed(2)), ((canvasVert2[1]/10).toFixed(2)) ],
			[ ((canvasVert1[0]/10).toFixed(2)), ((canvasVert1[1]/10).toFixed(2)) ],
			
		] );
	}

	if( maskControls.getValue( 'outline' ) ) {
		mask.render();
	}

	// hgrid.renderPoints();

	console.log( linesList );


	
}