import Canvas from './Canvas.js';
import Point from './Point.js';
const Matrix = window.TransformationMatrix;

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

	rotate( degrees, center ) {
		if( center == undefined ) center = new p5.Vector( 0, 0 );
		const m = Matrix.compose(
			Matrix.translate( center.x, center.y ),
			Matrix.rotateDEG( degrees ),
			Matrix.translate( -center.x, -center.y ),
		);
		for( let vert of this.vertices ) {
			const p = Matrix.applyToPoint( m, vert );
			vert.x = p.x;
			vert.y = p.y;
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