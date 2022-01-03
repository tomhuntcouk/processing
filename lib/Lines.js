
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