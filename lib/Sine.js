import Canvas from '../lib/Canvas.js';


class Sine {
	constructor() {
		this.frequency = 1;
		this.offset = 0;
	}

	create( frequency, offset ) {
		this.frequency = frequency;
		this.offset = offset;
		return this;
	}

	offsetPointList( pointlist, amplitude ) {
		for( const vert of pointlist.vertices ) {
			let i = vert.x / Canvas.width;
			i += this.offset;
			const s = sin( PI*i*this.frequency );

			vert.x += s * amplitude;
		}
	}


}

export default Sine;