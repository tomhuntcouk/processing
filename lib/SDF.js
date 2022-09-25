import Shape from './Shape.js';
import * as TransMatrix from './Matrix.js';

class SDF extends Shape {
	constructor() {
		super();	
	}

	calculateAtPoint( vector3 ) {
		let e = [];
		let v = [];
		let pq = [];

		const N = this.vertices.length;
		for( let i=0; i<N; i++ ) {
			let i2  = int(float(i + 1) % float(N));
			e[i]    = TransMatrix.Vector3.subtract(this.vertices[i2], this.vertices[i] );
			v[i]    = TransMatrix.Vector3.subtract( vector3, this.vertices[i] );
			let pq1 = TransMatrix.Vector3.subtract( v[i], e[i] );
			let pq2 = Math.min( Math.max(
				TransMatrix.Vector3.dot( v[i], e[i] ) /
				TransMatrix.Vector3.dot( e[i], e[i] ), 0
			), 1);
			pq[i]   = TransMatrix.Vector3.scale( pq1, pq2 );			
		}

		let d = TransMatrix.Vector3.dot( pq[0], pq[0] );
		for( let i=1; i<N; i++ ) {
			d = Math.min( d, TransMatrix.Vector3.dot( pq[i], pq[i] ) );
		}

		let wn = 0;
		for( let i=0; i<N; i++ ) {
			let i2 = float(i + 1) % float(N);
			let cond1 = 0.0 <= v[i].y;
			let cond2 = 0.0 > v[i2].y;
			let val3 = TransMatrix.Vector3.cross( e[i], v[i] );
			wn += cond1 && cond2 && val3 > 0.0 ? 1 : 0;
			wn -= !cond1 && !cond2 && val3 < 0.0 ? 1 : 0;
		}

		let s = wn == 0 ? 1.0 : -1.0;
		let r = Math.sqrt(d) * s;
		return r;

	}

}

export default SDF;