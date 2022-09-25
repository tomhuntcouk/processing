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

	smooth( resolution=2, sharpness=0.5 ) {

		if( resolution == 0 ) return;

		let smoothedVertices = [];
		
		const len = this.vertices.length;
		console.log(len);
		// console.log(this.vertices);
		for( let i=0; i<len; i++ ) {

			let v1 = TransMatrix.Vector3.lerp( this.vertices[(i)%len], this.vertices[(i+1)%len], sharpness );
			let v2 = this.vertices[(i+1)%len];
			let v3 = TransMatrix.Vector3.lerp( this.vertices[(i+1)%len], this.vertices[(i+2)%len], 1-sharpness );

			// console.log( i, (i+1)%len, (i+2)%len );

			let quadraticBezier = function(v1, v2, v3, t) {				
				const x = (1 - t) * (1 - t) * v1.x + 2 * (1 - t) * t * v2.x + t * t * v3.x;
				const y = (1 - t) * (1 - t) * v1.y + 2 * (1 - t) * t * v2.y + t * t * v3.y;
				return new TransMatrix.Vector3( x, y );
			}

			smoothedVertices.push(v1);
			const inc = 1 / resolution;
			let j = inc;
			while( j < 1 ) {				
				smoothedVertices.push( quadraticBezier( v1, v2, v3, j ) );
				j += inc;				
			}
		}

		this.vertices = smoothedVertices;
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
		
	render( close=true, max=10000 ) {		
		beginShape();
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) {
				endShape();
				beginShape();
			} else {
				if( max ) {
					const canvasVert = Canvas.applyMatrix( vert );			
					vertex( canvasVert.x, canvasVert.y );
					max--;
				}				
			}			
		}
		if( close ) {
			const canvasVert = Canvas.applyMatrix( this.vertices[0] );			
			vertex( canvasVert.x, canvasVert.y );
		}
		endShape();
	}

	renderPoints( max=10000, radius=5 ) {
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) continue;
			
			if( max ) {
				const canvasVert = Canvas.applyMatrix( vert );
				circle(
					canvasVert.x,
					canvasVert.y,
					radius
				);
				max--;
			}

		}
	}

	renderBounds() {
		for( const i in this.bounds ) {
			
			console.log(this.bounds);
			const vert = this.bounds[i];
			
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