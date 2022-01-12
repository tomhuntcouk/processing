import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';
import Circle from '../lib/Circle.js';
// import Point from '../lib/Point.js';


let c;

window.setup = function() {
	Canvas.create(
		150,
		150,
		2
	);

	c = new Circle( 'circle1' );
}


window.draw = function() {
	clear();
	background(255, 243, 212); 
	noFill();

	Canvas.pushMatrix();
	Canvas.translate( -width/2, -height/2 );

	let l = new Line();
	l.create( 
		new p5.Vector( 0, 0 ),
		new p5.Vector( width, height ),
		20
	);
	l.render();

	Canvas.popMatrix();
	
	c.create(
		c.controls.getValue('radius'),
		new p5.Vector( 0, 0 ),
		c.controls.getValue('resolution'),
		c.controls.getValue('start'),
		c.controls.getValue('end'),
	);

	c.rotate( c.controls.getValue('rotate') );

	c.render();

}