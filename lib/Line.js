import Shape from './Shape.js';
// import Point from './Point.js';
import * as TransMatrix from './Matrix.js';

class Line extends Shape {
	constructor() {
		super();

		this.start = new TransMatrix.Vector3(0,0);
		this.end = new TransMatrix.Vector3(0,0);

	}

	create( start, end, resolution ) {
		this.start = start;
		this.end = end;

		for( let i=0; i <= resolution; i++ ) {
			const t = i / resolution;
			const p = TransMatrix.Vector3.lerp( this.start, this.end, t );
			this.addVertex( p );
		}
	}

}

export default Line;