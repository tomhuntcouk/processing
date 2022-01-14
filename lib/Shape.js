import Canvas from './Canvas.js';
// import Point from './Point.js';
// const Matrix = window.TransformationMatrix;
const Matrix = window.glMatrix;
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

	rotate( degrees, center ) {
		if( center == undefined ) center = Matrix.vec4.create();
		
		let m = Matrix.mat4.create();
		Matrix.mat4.fromZRotation( m, radians(degrees) );
		console.log( m );

		// const m = Matrix.compose(
		// 	Matrix.translate( center.x, center.y ),
		// 	Matrix.rotateDEG( degrees ),
		// 	Matrix.translate( -center.x, -center.y ),
		// );
		
		for( let vert of this.vertices ) {
			// const p = Matrix.applyToPoint( m, vert );
			// Matrix.vec3.transformMat3( vert, vert, m );
			// vert.x = p.x;
			// vert.y = p.y;
		}
	}

	render() {		

		beginShape();

		for( const vert of this.vertices ) {
			// console.log( vert);
			const canvasVert = Canvas.applyMatrix( vert );
			vertex( canvasVert.x, canvasVert.y );
		}

		endShape();
	}

}

export default Shape;