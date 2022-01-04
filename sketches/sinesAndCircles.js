var slider0;
var slider1;
var slider2;
var slider3;

const WIDTH = 150;
const HEIGHT = 150;
const SCALEMULT = 2;

let _matrix;

let controls;
let snapshots;

let _lines;
let _circle;
let _border;

function setup() {
	pixelDensity(1);
	createCanvas(WIDTH * SCALEMULT, HEIGHT * SCALEMULT);
	noLoop();

	_matrix = new Matrix( drawingContext );
	
	controls = new Controls();
	snapshots = new Snapshots(controls);

	_lines = new LinesComp( controls );
	_border = new Border( controls );
	_circle = new Circle(controls);

	controls.addSlider('offset', 		0, 1, 0, 0 );
	controls.addSlider('power',	 		1, 8, 1, 1 );
	controls.addSlider('cycles', 		2, 8, 2, 2 );
	controls.addSlider('squeeze', 		0, 8, 2, 0 );
	controls.addSlider('lengthOffsetX', 0, 2, 0, 0 );
	controls.addSlider('lengthOffsetY', 0, 1, 0, 0 );
	controls.addSlider('lengthScale', 	0, 1, 1, 0 );
	controls.addSlider('lengthFreq', 	0, 4, 1, 0.5 );

	controls.addSlider('rotate',	 	0, 360, 0, 5 );	

	snapshots.getLatest();

	let printButton = createButton( 'PRINT' );
	printButton.mousePressed( print );
}

function print() {
	let printCommands = {}

	// border
	let borderPrint = {
		thickness : {
			x : ((_border.borderThickness.x * WIDTH) / 10).toFixed(1),
			y : ((_border.borderThickness.y * HEIGHT) / 10).toFixed(1),
		},
		outline : _border.outlineThickness
	};
	printCommands['border'] = borderPrint;

	// circle
	let circlePrint = {
		radius : ((_circle.radius * WIDTH) / 10 ).toFixed(1),
		position : {
			x : ((_circle.position.x * WIDTH) / 10 ),
			y : ((_circle.position.y * HEIGHT) / 10 )
		}
	}
	circlePrint.position = _matrix.applyToPoint( circlePrint.position.x, circlePrint.position.y );
	printCommands['circle'] = circlePrint;

	// _lines
	let linesPrint = [];
	const stretch = controls.getValue('stretch');
	for( const line of _lines.lines ) {
		let lineInfo = {
			x : ((line.offset * WIDTH) / 10),
			y : ((line.length * HEIGHT) / 10)
		}
		console.log(lineInfo);
		lineInfo = _matrix.applyToPoint( lineInfo.x, lineInfo.y );
		console.log(lineInfo);
		linesPrint.push(lineInfo);
	}
	printCommands['lines'] = linesPrint;

	console.log(printCommands);
}


function draw() {

	clear();

	_matrix.reset();

	controls.updateDisplay();
	snapshots.storeLatest();

	_lines.init();
	_circle.init();
	_border.init();


  // test
  _lines.process(
  	i => i
  );
  
  // sine compressing in middle
  _lines.process(
  	(i) => {
  		let v = i;
  		v += controls.getValue('offset');
  		v *= controls.getValue('cycles');
		// v = pow( v, controls.getValue('power') );

		v = sin( PI * v  );
		
		return i + v * ((controls.getValue('squeeze') / _lines.numlines ))
	},
		'offset'
	);

  // cut height with sine
  _lines.process(
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


  // push();

  // console.log(_matrix);

  // _matrix.scale(2,2);

  _matrix.translate(width/2, height/2);
  _matrix.rotate(radians(-controls.getValue('rotate')));
  _matrix.translate( -width/2, -height/2 );

  // console.log(_matrix);

  // push();
  _matrix.translate( -((controls.getValue('stretch') - 1 ) / 2) * width, 0, 0 );
  _lines.render();
  _matrix.translate( ((controls.getValue('stretch') - 1 ) / 2) * width, 0, 0 );
  // pop();
  
  _circle.render();

  _border.render();


  // pop();


}