var slider0;
var slider1;
var slider2;
var slider3;

const WIDTH = 150;
const HEIGHT = 150;
const SCALEMULT = 2;

let controls;
let snapshots;

function setup() {
	createCanvas(WIDTH * SCALEMULT, HEIGHT * SCALEMULT);
	// angleMode(DEGREES); 
	
	controls = new Controls();
	snapshots = new Snapshots(controls);
  
	controls.addSlider('numlines', 		1, 100, 20, 1 );
	controls.addSlider('stretch', 		1, 2, 1, 0 );
	controls.addSlider('offset', 		0, 1, 0, 0 );
	controls.addSlider('power',	 		1, 8, 1, 1 );
	controls.addSlider('cycles', 		2, 8, 2, 2 );
	controls.addSlider('squeeze', 		0, 8, 2, 0 );
	
	controls.addSlider('radius', 		0, 2, 0.25, 0 );
	controls.addSlider('circleX', 		0, 1, 0.5, 0 );
	controls.addSlider('circleY', 		0, 1, 0.5, 0 );
	controls.addSlider('circleStrk', 	0, 10, 0, 1 );

	controls.addSlider('lengthOffsetX', 0, 2, 0, 0 );
	controls.addSlider('lengthOffsetY', 0, 1, 0, 0 );
	controls.addSlider('lengthScale', 	0, 1, 1, 0 );
	controls.addSlider('lengthFreq', 	0, 4, 1, 0.5 );

	controls.addSlider('rotate',	 	0, 360, 0, 90 );
	controls.addSlider('outline', 		0, 10, 0, 1 );
	controls.addSlider('border', 		1, 30, 1, 1 );

	snapshots.getLatest();
}

class Line {
  constructor( position, parent=null ) {
	this.position = position;
	this.parent = parent;
	this.offset = position;
	this.length = 1;
  };
  
  render( scaleX, scaleY ) {

	let x = this.offset;
	let y = this.length;	

	x *= scaleX;
	y *= scaleY;

	y = max( min( y, height ), 0 );
	line( x , 0, x, y );
	
  };
}


class LinesComp {
  constructor( numlines ) {
	this.numlines = numlines;
	this.lines = [];
	
	this.root = new Line( 0 );
	
	this.lines.push( new Line( 0, this.root ) );    
	for( let i=1; i<=numlines; i++ ) {
	  let position = i / numlines;
	  let line = new Line( position, this.lines[i-1] )
	  this.lines.push( line );
	}
  };
  
  process( func, param ) {
	for( const line of this.lines ) {
	  let o = func( line.offset );
	  line[param] = o;
	}
  };
  
  render() {
	for( const line of this.lines ) {
	  line.render( width * controls.getValue('stretch'), height );
	}
  };
  
}


function draw() {
  
  // clear();

  controls.updateDisplay();
  snapshots.storeLatest();

  const NUMLINES = controls.getValue('numlines');
  const MULT = 1 / NUMLINES;
  const OFFSET = (width / NUMLINES) / 2;
  
  lines = new LinesComp( NUMLINES );
  

  // test
  lines.process(
	i => i
  );
  
  // sine compressing in middle
  lines.process(
	(i) => {
		let v = i;
		v += controls.getValue('offset');
		v *= controls.getValue('cycles');
		// v = pow( v, controls.getValue('power') );

		v = sin( PI * v  );
		
		return i + v * ((controls.getValue('squeeze')/NUMLINES))
	},
	'offset'
  );

  // cut height with sine
  lines.process(
	(i) => {
		let v = i;
		v += controls.getValue( 'lengthOffsetX' );
		v *= controls.getValue( 'lengthFreq' );

		v = controls.getValue( 'lengthScale' ) * sin( PI * v ) + controls.getValue( 'lengthOffsetY' );;
		return v;
	},
	'length'
  );
  

  background(255, 243, 212); 	
  fill(255, 243, 212);
  stroke(150);
  strokeWeight(1);


  push();
  translate(width/2, height/2);
  rotate(radians(-controls.getValue('rotate')));
  // scale( 1-controls.getValue('border') );
  translate( -width/2, -height/2 );

  push();
  translate( -((controls.getValue('stretch') - 1 ) / 2) * width, 0, 0 );
  lines.render();
  pop();
  
  strokeWeight( controls.getValue('circleStrk') );
  circle( controls.getValue('circleX') * width, controls.getValue('circleY') * height, controls.getValue('radius') * width * 2 );

  // noFill();
  strokeWeight( controls.getValue('outline') );
  // rect( 0, 0, width, height );

  const o = (controls.getValue( 'outline' ) * SCALEMULT ) / 2;
  const bx = ( 1 / controls.getValue( 'border' ) ) * width;
  const by = ( 1 / controls.getValue( 'border' ) ) * height;
  

  beginShape();
  vertex( 0 - o, 0 - o );
  vertex( width + o, 0 - o );
  vertex( width + o, height + o );
  vertex( 0 - o, height + o );
  
  beginContour()
  vertex( bx, height - by );
  vertex( width - bx, height - by );
  vertex( width - bx, by );
  vertex( bx, by );
  endContour();

  endShape(CLOSE);


  pop();


}