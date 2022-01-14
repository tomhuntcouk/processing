import Canvas from './Canvas.js';
// import Point from './Point.js';
// const Matrix = window.TransformationMatrix;
// import Matrix from './Matrix.js';
import * as TransMatrix from './Matrix.js';
// console.log( window );

class Shape {
	constructor() {
		this.vertices = [];		
		this.resolution = this.vertices.length;
	}

	clear() {
		this.vertices = [];
	}

	create( ...verts ) {
		for( const vertex of verts ) {
			this.addVertex( vertex );
		}
	}

	addVertex( vertex ) {
		this.vertices.push( vertex );
		this.resolution = this.vertices.length;
	}

	noise( amplitude, frequency, time ) {
		if( frequency == undefined ) frequency = 1;
		if( time == undefined ) time = 0;
		for( let vert of this.vertices ) {
			let n = noise( vert.x * frequency, vert.y * frequency, time );
			n = (n - 0.5 ) * 2;
			vert.add( n * amplitude );
		}
	}

	rotate( degrees, axis, center ) {
		if( axis == undefined ) axis = new TransMatrix.Vector3( 0, 0, 1 );
		if( axis == 'X' ) axis = new TransMatrix.Vector3( 1, 0, 0 );
		if( axis == 'Y' ) axis = new TransMatrix.Vector3( 0, 1, 0 );
		if( axis == 'Z' ) axis = new TransMatrix.Vector3( 0, 0, 1 );

		if( center == undefined ) center = new TransMatrix.Vector3();
		
		let m = new TransMatrix.Matrix4();
		m.translate( center );
		m.rotate( degrees, axis );
		
		for( let vert of this.vertices ) {
			m.applyToPoint( vert );			
		}
	}

	render() {		

		beginShape();

		for( const vert of this.vertices ) {
			const canvasVert = Canvas.applyMatrix( vert );
			vertex( canvasVert.x, canvasVert.y );
		}

		endShape();
	}

}

export default Shape;