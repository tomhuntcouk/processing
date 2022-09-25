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

	timeControls = Controls.addGroup('time');
	timeControls.addCheckbox( 'play', false );
	timeControls.addSlider( 'speed', 0, 2, 1, 0.01 );
	timeControls.addSlider( 'rate', 1, 120, 30, 1 );
	timeControls.addInput( 'framerate', 0 );

	gridControls = Controls.addGroup( 'grid' );
	gridControls.addSlider( 'xres', 1, 100, 1, 2 );
	gridControls.addSlider( 'yres', 1, 100, 1, 2 );
	gridControls.addSlider( 'rotation', 0, 360, 0, 1 );

	maskControls = Controls.addGroup( 'mask' );
	maskControls.addSlider( 'radius', 1, 100, 1, 1 );
	maskControls.addSlider( 'resolution', 3, 180, 20, 1 );
	maskControls.addSlider( 'rotation', 0, 360, 0, 5 );
	maskControls.addSlider( 'offset', -100, 100, 0, 1 );
	maskControls.addSlider( 'capsize', 0, 10, 0, 1 );
	maskControls.addSlider( 'sections', 1, 100, 0, 1 );
	maskControls.addSlider( 'height', 1, 100, 0, 1 );
	maskControls.addSlider( 'noiseFreq', 0, 0.2, 0, 0.001 );
	maskControls.addSlider( 'noiseAmp', 0, 1, 0, 0.01 );
	maskControls.addSlider( 'depthCull', -1000, 1000, 0, 1 );

	lineControls = Controls.addGroup( 'line' );
	lineControls.addSlider( 'noiseAmp', 0, 0.1, 0, 0.01 );
	lineControls.addSlider( 'noiseFreq', 0, 0.1, 0, 0.01 );
	lineControls.addSlider( 'holiness', 0, 1, 0, 0.01 );	
	lineControls.addSlider( 'noiseOffsetY', 0, Canvas.height, 0, 0.1 );



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

	
	const inc = 2 / maskControls.getValue('sections');
	for( let i=-1; i<=1; i += inc ) {

		let theta = i;

		let crossSectionRadius = Math.sin(
			Math.acos(			
				theta,
				// maskControls.getValue('theta'),
				maskControls.getValue('radius')
			)
		) * maskControls.getValue('radius');

		crossSectionRadius = Math.max( crossSectionRadius, maskControls.getValue('capsize') );


		let circle = new Circle();
		circle.create(
			crossSectionRadius,
			maskControls.getValue('resolution'),
			circle.center,
			// 0.25,
			// 0.5
		);

		let offset = theta * maskControls.getValue('radius');		

		// circle.noise(
		// 	maskControls.getValue('noiseAmp'),
		// 	maskControls.getValue('noiseFreq'),
		// );		

		// let n = noise( crossSectionRadius * maskControls.getValue('noiseFreq') ) * maskControls.getValue('noiseAmp') + 0.5;
		// circle.scale(
		// 	new TransMatrix.Vector3( n, n, n )
		// );

		circle.addRandomBreaks(
			lineControls.getValue('holiness')
		);


		circle.translate(
			new TransMatrix.Vector3( 
				0,
				0,
				offset
			)
		);

		circle.rotate( 
			maskControls.getValue('rotation'),
			'X'
		);

		// circle.close();
		circle.cull( maskControls.getValue('depthCull') );		

		circle.render(false);
	}

	
}