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
	
	render() {
		for( const line of this.lines ) {
			line.render( width * this.controls.getValue('stretch'), height );
		}
	};
	
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


