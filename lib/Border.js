import Canvas from '../lib/Canvas.js';
import Line from '../lib/Line.js';

import * as TransMatrix from '../lib/Matrix.js';

class Border {
	constructor() {
		this.size = 0;

		this.minX = 0;
		this.maxX = Canvas.width;
		this.minY=0;
		this.maxY=Canvas.height;
	}

	create( size ) {
		this.size = size;

		this.minX += this.size;
		this.maxX -= this.size;
		this.minY += this.size;
		this.maxY -= this.size;
	}

	cropPointList( pointlist ) {
		let inBounds = []
		for( const vert of pointlist.vertices ) {
			vert.x = min( max( this.minX, vert.x ), this.maxX);
			vert.y = min( max( this.minY, vert.y ), this.maxY);
			const xBound = vert.x == this.minX || vert.x == this.maxX;
			const yBound = vert.y == this.minY || vert.y == this.maxY;

			inBounds.push( xBound && yBound );
		}

		if( inBounds.every( (v) => {return v} ) ) {
			pointlist.clear();
		}
	}

	render() {
		const v1 = new TransMatrix.Vector3( this.minX, this.minY );
		const v2 = new TransMatrix.Vector3( this.maxX, this.minY );
		const v3 = new TransMatrix.Vector3( this.maxX, this.maxY );
		const v4 = new TransMatrix.Vector3( this.minX, this.maxY );

		const line1 = new Line().create( v1, v2 ).render();
		const line2 = new Line().create( v2, v3 ).render();
		const line3 = new Line().create( v3, v4 ).render();
		const line4 = new Line().create( v4, v1 ).render();
	}

}


export default Border;
