import PointList from './PointList.js';
import * as TransMatrix from './Matrix.js';

class Grid extends PointList {
	constructor() {
		super();
		this.res = {
			x: 1,
			y: 1
		}
		this.size = {
			x: 100,
			y: 100
		}
	}

	get resolution() {
		return this.res;
	}

	create( resX=1, resY=1, width=100, height=100 ) {
		this.resolution.x = Math.max(resX - 1, 0);
		this.resolution.y = Math.max(resY - 1, 0);
		this.size.x = width;
		this.size.y = height;

		const startp = new TransMatrix.Vector3( 0, 0 );
		const endp = new TransMatrix.Vector3( this.size.x, this.size.y );

		for( let y = 0; y <= this.resolution.y; y++ ) {
			for( let x = 0; x <= this.resolution.x; x++ ) {
				const xt = this.resolution.x > 0 ? x / this.resolution.x : 0.5;
				const yt = this.resolution.y > 0 ? y / this.resolution.y : 0.5;

				const px = TransMatrix.Vector3.lerp( startp, endp, xt );
				const py = TransMatrix.Vector3.lerp( startp, endp, yt );

				const p = new TransMatrix.Vector3( px.x, py.y );

				this.addVertex(p);
			}
		}
	}

	center() {
		this.translate( 
			new TransMatrix.Vector3( 
				-( this.size.x / 2 ),
				-( this.size.y / 2 )
		 	)
	 	);
	}


}

export default Grid;