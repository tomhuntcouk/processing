import PointList from './PointList.js';
import * as TransMatrix from './Matrix.js';
import Controls from './Controls.js';



class Grid extends PointList {
	constructor() {
		super();
		this.res = {
			x: 1,
			y: 1
		}
		this.size = {
			x: 100,
			y: 100,
			z: 100
		}
	}

	get resolution() {
		return this.res;
	}

	get width() {
		return this.size.x;
	}

	get height() {
		return this.size.y;
	}

	create( resX=1, resY=1, width=100, height=100, resZ=1, depth=100 ) {
		this.res.x = Math.max(resX - 1, 0);
		this.res.y = Math.max(resY - 1, 0);
		this.res.z = Math.max(resZ - 1, 0);
		this.size.x = width;
		this.size.y = height;
		this.size.z = depth;

		this.clear();

		const startp = new TransMatrix.Vector3( 0, 0, 0 );
		const endp = new TransMatrix.Vector3( this.size.x, this.size.y, this.size.z );

		for( let z = 0; z <= this.resolution.z; z++ ) {
			for( let y = 0; y <= this.resolution.y; y++ ) {
				for( let x = 0; x <= this.resolution.x; x++ ) {
					const xt = this.resolution.x > 0 ? x / this.resolution.x : 0.5;
					const yt = this.resolution.y > 0 ? y / this.resolution.y : 0.5;
					const zt = this.resolution.z > 0 ? z / this.resolution.z : 0.5;

					const px = TransMatrix.Vector3.lerp( startp, endp, xt );
					const py = TransMatrix.Vector3.lerp( startp, endp, yt );
					const pz = TransMatrix.Vector3.lerp( startp, endp, zt );

					const p = new TransMatrix.Vector3( px.x, py.y, pz.z );

					this.addVertex(p);
				}
			}
		}
	}

	center() {
		this.translate( 
			new TransMatrix.Vector3( 
				-( this.size.x / 2 ),
				-( this.size.y / 2 ),
				-( this.size.z / 2 ),
		 	)
	 	);
	}


}

export default Grid;