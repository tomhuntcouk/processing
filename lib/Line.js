import Shape from './Shape.js';
// import Point from './Point.js';

class Line extends Shape {
	constructor() {
		super();

		this.start = new p5.Vector(0,0);
		this.end = new p5.Vector(0,0);

	}

	create( start, end, resolution ) {
		this.start = start;
		this.end = end;

		for( let i=0; i <= resolution; i++ ) {
			const t = i / resolution;
			const p = p5.Vector.lerp( this.start, this.end, t );
			this.addVertex( p );
		}
	}

}

export default Line;