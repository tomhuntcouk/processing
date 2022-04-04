import Shape from './Shape.js';
import * as TransMatrix from './Matrix.js';

class HilbertCurve extends Shape {

	constructor() {
		super();
		this.order = 1;

		this.positions = [
	    /* 0: */ [0, 0],
	    /* 1: */ [0, 1],
	    /* 2: */ [1, 1],
	    /* 3: */ [1, 0]
	    ];
	}

	create( resolution=8, scale=10 ) {
		// console.log(resolution, scale);

		const length = resolution * resolution;
		let curr;
		for( let i = 0; i < length; i += 1 ) {
			curr = this.hilbertIndexToXY( i, resolution );
			curr = [ curr[0] / resolution, curr[1] / resolution ];
			this.addVertex( new TransMatrix.Vector3(
				curr[0] * scale,
				curr[1] * scale
				// (curr[0] * scale) - (scale / 2) + ( (scale / resolution) / 2 ),
				// (curr[1] * scale) - (scale / 2) + ( (scale / resolution) / 2 )
			) );
		}
	}

	createMoore( order=2, scale=10 ) {
		
	}

	hilbertIndexToXY( hindex, N ) {

		function last2bits( x ) {
			return x & 3;
		}


		let tmp = this.positions[ last2bits( hindex ) ];
	    hindex = (hindex >>> 2);
	    let [x, y] = tmp;

	    for (var n = 4; n <= N; n *= 2) {
	        var n2 = n / 2;

	        switch (last2bits(hindex)) {
	        case 0: /* case A: left-bottom */
	            tmp = x; x = y; y = tmp;
	            break;

	        case 1: /* case B: left-upper */
	            x = x;
	            y = y + n2;
	            break;

	        case 2: /* case C: right-upper */
	            x = x + n2;
	            y = y + n2;
	            break;

	        case 3: /* case D: right-bottom */
	            tmp = y;
	            y = (n2-1) - x;
	            x = (n2-1) - tmp;
	            x = x + n2;
	            break;
	        }
        
	        hindex = (hindex >>> 2);
	    }

	    return [ x, y ];

	}


}

export default HilbertCurve;