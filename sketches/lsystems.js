"use strict";
import Time from '../lib/Time.js';
import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';
import Grid from '../lib/Grid.js';
import Border from '../lib/Border.js';
import PolygonMask from '../lib/PolygonMask.js';
import Sine from '../lib/Sine.js';

import LSystem from '../lib/LSystem.js';

import Controls from '../lib/Controls.js';
import Snapshots from '../lib/Snapshots.js';
// import Renderer from '../lib/Renderer.js';

import * as TransMatrix from '../lib/Matrix.js';

const NAME = 'LinesAndSines';
const WIDTH = 150;
const HEIGHT = 150;
const SCALE = 2;

// let circleControls;
let gridControls, borderControls, sineControls, maskControls, lineControls, circleControls, lightControls, curveControls;
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
	maskControls.addSlider( 'noiseFreq', 0, 0.1, 0, 0.01 );
	maskControls.addSlider( 'noiseAmp', 0, 1, 0, 0.01 );

	lineControls = Controls.addGroup( 'line' );
	lineControls.addSlider( 'resolution', 3, 180, 20, 1 );
	lineControls.addSlider( 'holiness', 0, 1, 0, 0.01 );	
	lineControls.addSlider( 'noiseOffsetY', 0, Canvas.height, 0, 0.1 );

	curveControls = Controls.addGroup( 'curve' );
	curveControls.addSlider( 'order', 1, 8, 1, 1 );
	curveControls.addSlider( 'scale', 1, Canvas.height, 1, 1 );	
	curveControls.addSlider( 'max', 0, 50, 1, 1 );
	curveControls.addSlider( 'smoothness', 0, 4, 0, 1 );
	curveControls.addSlider( 'angle', 0, 360, 0, 1 );

	// lightControls = Controls.addGroup( 'light' );
	// lightControls.addSlider( 'lightX', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightY', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightZ', -180, 180, 0, 1 );
	// lightControls.addSlider( 'lightIntensity', 0, 2, 1, 0.01 );

	sineControls = Controls.addGroup( 'sine' );
	sineControls.addSlider( 'frequency', 0, 10, 1, 1 );
	sineControls.addSlider( 'offset', -1, 1, 0, 0.01 );
	sineControls.addSlider( 'amplitude', 0, 10, 0, 0.01 );	


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


	let l1 = new LSystem();
	let l2 = new LSystem();
	l1.initPenroseTile();
	// l1.setAngle( 36 );
	// l1.initMooreCurve();
	// l1.setAngle(90);

	l2.setAxiom( 'X' );
	l2.addRule( 'X', 'F++F[+F]F' );
	l2.setAngle(45);

	// l.setAngle( curveControls.getValue('angle') );
	l1.create(
		curveControls.getValue('order'),
		curveControls.getValue('scale'),
		// curveControls.getValue('max'),
	);

	// l2.create(
	// 	curveControls.getValue('order'),
	// 	curveControls.getValue('scale'),
	// 	curveControls.getValue('max'),
	// );

	// l.updateBounds();
	// l.center( true, false );
	l1.render(close=false);
	l1.renderBounds();
	// l1.renderPoints(10000, 30);
	// l2.render(close=false);

	
}