class LinesComp {
	constructor( controls ) {

		this.controls = controls;
		
		this.numlines = 0;
		this.lines = [];
		this.root = new Line( 0 );
		
		this.controls.addSlider('numlines', 		1, 100, 20, 1 );
		this.controls.addSlider('stretch', 		1, 2, 1, 0 );		

	};
	
	init() {
		this.numlines = this.controls.getValue( 'numlines' );
		this.lines = [];
		this.lines.push( new Line( 0, this.root ) );    
		for( let i=1; i<=this.numlines; i++ ) {
			let position = i / this.numlines;
			let line = new Line( position, this.lines[i-1] )
			this.lines.push( line );
		}
	}

	process( func, param ) {
		for( const line of this.lines ) {
			let o = func( line.offset );
			line[param] = o;
		}
	};
	
	render( matrix ) {
		for( const line of this.lines ) {
			line.render( width * this.controls.getValue('stretch'), height, matrix );
		}
	};
	
}


class Line {
	constructor( position, parent=null ) {
		this.position = position;
		this.parent = parent;
		this.offset = position;
		this.length = 1;
		this.points = [];
	};


	
	render( scaleX, scaleY, matrix ) {

		let x = this.offset;
		let y = this.length;	

		x *= scaleX;
		y *= scaleY;

		y = max( min( y, height ), 0 );
		
		let p1 = matrix.applyToPoint(x, 0);
		let p2 = matrix.applyToPoint(x, y);

		// console.log(p);
		// let p = {'x':x, 'y':y};
		this.points = [p1, p2];

		line( p1.x, p1.y, p2.x, p2.y );
		// console.log((p.x/10).toFixed(1), (p.y/10).toFixed(1));

	};
}


