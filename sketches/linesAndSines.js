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
// import Renderer from '../lib/Renderer.js';

import * as TransMatrix from '../lib/Matrix.js';

const NAME = 'LinesAndSines';
const WIDTH = 150;
const HEIGHT = 150;
const SCALE = 2;

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

	gridControls = Controls.addGroup( 'grid' );
	gridControls.addSlider( 'xres', 1, 100, 1, 2 );
	gridControls.addSlider( 'xrot', 0, 360, 0, 1 );
	// gridControls.addSlider( 'xoffset', -width, width, 0, 1 );

	maskControls = Controls.addGroup( 'mask' );
	maskControls.addSlider( 'radius', 1, 100, 1, 1 );
	maskControls.addSlider( 'resolution', 3, 180, 20, 1 );
	maskControls.addSlider( 'rotation', 0, 360, 0, 5 );
	maskControls.addSlider( 'noiseFreq', 0, 0.1, 0, 0.01 );
	maskControls.addSlider( 'noiseAmp', 0, 1, 0, 0.01 );

	lineControls = Controls.addGroup( 'line' );
	lineControls.addSlider( 'resolution', 3, 180, 20, 1 );
	lineControls.addSlider( 'holiness', 0, 1, 0, 0.01 );	
	lineControls.addSlider( 'noiseOffsetY', 0, Canvas.height, 0, 0.1 );

	lightControls = Controls.addGroup( 'light' );
	lightControls.addSlider( 'lightX', -180, 180, 0, 1 );
	lightControls.addSlider( 'lightY', -180, 180, 0, 1 );
	lightControls.addSlider( 'lightZ', -180, 180, 0, 1 );
	lightControls.addSlider( 'lightIntensity', 0, 2, 1, 0.01 );

	circleControls = Controls.addGroup( 'circle' );
	circleControls.addSlider( 'radius', 0, Canvas.width, 100, 1 );
	circleControls.addSlider( 'rotation', 0, 360, 0, 5 );
	circleControls.addSlider( 'holiness', 0, 1, 0, 0.01 );

	sineControls = Controls.addGroup( 'sine' );
	sineControls.addSlider( 'frequency', 0, 10, 1, 1 );
	sineControls.addSlider( 'offset', -1, 1, 0, 0.01 );
	sineControls.addSlider( 'amplitude', 0, 10, 0, 0.01 );

	timeControls = Controls.addGroup('time');
	timeControls.addCheckbox( 'play', false );
	timeControls.addSlider( 'speed', 0, 2, 1, 0.01 );
	timeControls.addSlider( 'rate', 1, 120, 30, 1 );
	timeControls.addInput( 'framerate', 0 );


	// Renderer.init( drawingContext );

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
		// timeControls.setValue( 'framerate', frameRate().toFixed(2) );		
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

	let grid = new Grid();
	grid.create( 
		gridControls.getValue('xres'),
		1,
		Canvas.width * 2,
		0
	);	
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
	// mask.render();
	
	const lightDir = new TransMatrix.Vector3(
		// sin( radians( (((lightControls.getValue( 'lightX' ) % 2) * 0.5) - 0.5) * 2 ) ),
		// sin( radians( (((lightControls.getValue( 'lightY' ) % 2) * 0.5) - 0.5) * 2 ) ),
		// cos( radians( (((lightControls.getValue( 'lightZ' ) % 2) * 0.5) - 0.5) * 2 ) ),
		sin( radians( lightControls.getValue( 'lightX' ) ) ),
		sin( radians( lightControls.getValue( 'lightY' ) ) ),
		cos( radians( lightControls.getValue( 'lightZ' ) ) ),
	);

	for( let i=0; i<grid.vertices.length; i++ ) {
		const gridvert = grid.vertices[i];

		const line = new Line();		
		const start = TransMatrix.Vector3.add( gridvert, [0, -Canvas.height/2, 0] );
		const end = TransMatrix.Vector3.add( start, [0, Canvas.height, 0] );

		// Canvas.pushMatrix();
		// Canvas.rotate(
		// 	gridControls.getValue( 'xrot' )
		// );

		line.rotate(
			gridControls.getValue( 'xrot' )
		);		

		line.create( start, end, 
			lineControls.getValue('resolution')
		);

		mask.maskPointList( line );		

		for( let j in line.vertices ) {
			const vert = line.vertices[j];
			const normal = maskPoly.normalAtPoint( vert );			
			
			const lambert = TransMatrix.Vector3.dot( normal, lightDir );
			let col = [ normal.x * 255, normal.y * 255, normal.z * 255 ];
			let light = lambert * 255;

			line.addRandomBreak(
				j,
				lambert * lightControls.getValue('lightIntensity'),
				new TransMatrix.Vector3(
					0,
					lineControls.getValue('noiseOffsetY')
				)
			);
		}

		
		// line.addRandomBreaks( lineControls.getValue('holiness') );
		line.render();	
		// Canvas.popMatrix();	
		// line.renderPoints( 2 );
		
	}	

	let polyCircle = new Circle();
	polyCircle.create(
		circleControls.getValue('radius'),
		360
	);	
	polyCircle.addRandomBreaks( 
		circleControls.getValue('holiness')
	);
	polyCircle.rotate( 
		circleControls.getValue('rotation')
	);
	polyCircle.render();


	
}