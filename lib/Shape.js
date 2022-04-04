import Canvas from './Canvas.js';
import PointList from './PointList.js';
import * as TransMatrix from './Matrix.js';
// import Random from './Random.js';

class Shape extends PointList {
	constructor() {
		super();
		this.bounds = {};
	}

	createFromCombine( ...shapes ) {
		for( let shape in shapes ) {
			this.append( ...shape.vertices );
		}
	}

	close() {
		this.addVertex( this.vertices[0].clone() );
	}

	smooth() {
		let smoothedVertices = [];
		const l = this.vertices.length;
		for( let i=0; i<l; i++ ) {
			let v1 = TransMatrix.Vector3.lerp( this.vertices[(i)%l], this.vertices[(i+1)%l], 0.5 );
			let v2 = TransMatrix.Vector3.lerp( this.vertices[(i+1)%l], this.vertices[(i+2)%l], 0.5  );

		}
	}

	updateBounds() {
		let bounds = {
			'left' : 0,
			'right' : 0,
			'top' : 0,
			'bottom' : 0,
			'width' : 0,
			'height' : 0
		}

		for( let vert of this.vertices ) {
			if( vert.x < bounds['left'] ) {
				bounds['left'] = vert.x;
			}

			if( vert.x > bounds['right'] ) {
				bounds['right'] = vert.x;
			}

			if( vert.y < bounds['top'] ) {
				bounds['top'] = vert.y;
			}

			if( vert.y > bounds['bottom'] ) {
				bounds['bottom'] = vert.y;
			}
		}

		bounds.width = Math.abs(bounds['left'] - bounds['right']);
		bounds.height = Math.abs(bounds['top'] - bounds['bottom']);

		this.bounds = bounds;
	}

	center( x=true, y=true ) {
		let offset = new TransMatrix.Vector3(
			x ? -this.bounds.width/2 : 0,
			y ? -this.bounds.height/2 : 0
		);
		this.translate( offset );
		this.updateBounds();
	}
		
	render() {		
		beginShape();
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) {
				endShape();
				beginShape();
			} else {
				const canvasVert = Canvas.applyMatrix( vert );			
				vertex( canvasVert.x, canvasVert.y );
			}			
		}
		endShape();
	}

	renderPoints( radius=5 ) {
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) continue;
			const canvasVert = Canvas.applyMatrix( vert );
			circle(
				canvasVert.x,
				canvasVert.y,
				radius
			);

		}
	}

}

export default Shape;