import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';

import Controls from '../lib/Controls.js';
import Snapshots from '../lib/Snapshots.js';

import * as TransMatrix from '../lib/Matrix.js';

let controls;

let c, l;

window.setup = function() {
	Canvas.create(
		150,
		150,
		2
	);

	c = new Circle( 'circle1' );
	l = new Line( 'line1' );

	controls = Controls.addGroup( 'sketch' );
	controls.addControl( 'noise', 0, 1, 0, 0.01 );
	controls.addControl( 'freq', 0, 0.1, 0, 0.001 );
	controls.addControl( 'time', 0, 10, 0, 0.01 );

	Snapshots.init( 'Test1' );
	Snapshots.applyLatest();

}


window.draw = function() {


	Snapshots.saveLatest();



	clear();
	background(255, 243, 212); 
	noFill();


	Canvas.pushMatrix();
	Canvas.translate( -width/2, -height/2 );


	l.create( 
		new TransMatrix.Vector3( 0, 0 ),
		new TransMatrix.Vector3( width, height ),
		20
	);
	l.render();

	Canvas.popMatrix();


	c.create(
		c.controls.getValue('radius'),
		new TransMatrix.Vector3(),
		c.controls.getValue('resolution'),
		c.controls.getValue('start'),
		c.controls.getValue('end')
	);

	c.noise( 
		controls.getValue('noise'),
		controls.getValue('freq'),
		controls.getValue('time')
	);
	c.rotate( c.controls.getValue('rotate') );

	c.render();

	

}